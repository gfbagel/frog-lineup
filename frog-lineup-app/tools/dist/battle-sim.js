#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
// We intentionally avoid importing Angular-bound modules at runtime.
// Instead we extract the exported array literal from the TypeScript source file
// (same folder: src/app/art-lineup/characterData.ts) and load it as a small
// runtime module. This keeps the simulator TypeScript-only while avoiding
// pulling in Angular runtime/decorator code.
// Resolve characterData relative to a few likely locations so this script works
// whether the compiled JS is placed in tools/dist, tools/dist/tools, or run
// directly from tools/. Try a few candidate paths and pick the first that exists.
function resolveCharFile() {
    const candidates = [
        path.resolve(__dirname, '..', 'src', 'app', 'art-lineup', 'characterData.ts'),
        path.resolve(__dirname, '..', '..', 'src', 'app', 'art-lineup', 'characterData.ts'),
        path.resolve(process.cwd(), 'src', 'app', 'art-lineup', 'characterData.ts'),
    ];
    for (const c of candidates)
        if (fs.existsSync(c))
            return c;
    // fallback to the repo-relative path (may error later with a clear message)
    return candidates[1];
}
const CHAR_FILE = resolveCharFile();
// keep CACHE_FILE for optional fast-path compatibility (not required when running via TS import)
const CACHE_FILE = path.join(__dirname, 'characters.json');
// Centralized defaults so tests and runs can change behavior in one place.
const DEFAULTS = {
    mpUsageProb: 0.25,
    maxTurns: 200,
    immediateLoss: true,
    mpStat: 'intelligence',
};
function readCharacters() {
    // If a JSON cache exists and looks valid, prefer it for speed.
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const j = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            if (Array.isArray(j) && j.length)
                return j;
        }
        catch (e) {
            console.warn('Failed to read cache, will load TS source:', e.message);
        }
    }
    // Load only the array literal from the TS source using bracket matching to avoid parsing other TS constructs.
    const src = fs.readFileSync(CHAR_FILE, 'utf8');
    const marker = 'export const characterList';
    const idx = src.indexOf(marker);
    if (idx === -1)
        throw new Error('characterList export not found in source');
    const eqIdx = src.indexOf('=', idx);
    if (eqIdx === -1)
        throw new Error('Could not find = after characterList export');
    const firstBracket = src.indexOf('[', eqIdx);
    if (firstBracket === -1)
        throw new Error('Opening [ for characterList not found');
    // Find matching closing bracket
    let depth = 0;
    let endIdx = -1;
    for (let i = firstBracket; i < src.length; i++) {
        const ch = src[i];
        if (ch === '[')
            depth++;
        else if (ch === ']') {
            depth--;
            if (depth === 0) {
                endIdx = i;
                break;
            }
        }
    }
    if (endIdx === -1)
        throw new Error('Could not find end of characterList array');
    const arrayText = src.slice(firstBracket, endIdx + 1);
    const tmpFile = path.join(__dirname, '_char_loader.js');
    const moduleText = `const Rank = {}; const StatMod = {}; const Generation = {}; const _REDACTEDTXT = null;\nmodule.exports = ${arrayText};\n`;
    fs.writeFileSync(tmpFile, moduleText, 'utf8');
    let list;
    try {
        delete require.cache[require.resolve(tmpFile)];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        list = require(tmpFile);
    }
    catch (e) {
        try {
            fs.unlinkSync(tmpFile);
        }
        catch (__) { }
        throw new Error('Failed to load characterList from TS source: ' + e.message);
    }
    try {
        fs.unlinkSync(tmpFile);
    }
    catch (__) { }
    if (!Array.isArray(list))
        throw new Error('characterList was not an array');
    const chars = list
        .map((c) => {
        // fallback to image filename for name, but strip .png/.PNG suffix if present
        let fallback = String(c.img || 'unknown');
        fallback = fallback.replace(/\.png$/i, '');
        return {
            name: c.name || fallback,
            stats: c.stats || {},
            ability: c.ability,
            weakness: c.weakness,
        };
    })
        .filter((c) => Object.keys(c.stats).length > 0);
    // Do not persist a cache by default to avoid duplicating source data in the repo.
    // If you want a cache file for speed, we can add a `--regen-cache` flag later.
    return chars;
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rollD10() {
    return randInt(1, 10);
}
function deriveStats(stats, opts) {
    var _a, _b, _c, _d, _e, _f;
    // MP is now derived from the best mental stat among intelligence, wisdom, and charisma.
    // This favors characters who are well-rounded mentally rather than only intelligence-based.
    const STR = ((_a = stats['strength']) !== null && _a !== void 0 ? _a : 0) - 3;
    const DEX = ((_b = stats['dexterity']) !== null && _b !== void 0 ? _b : 0) - 3;
    const CON = ((_c = stats['constitution']) !== null && _c !== void 0 ? _c : 0) - 3;
    const WIS = ((_d = stats['wisdom']) !== null && _d !== void 0 ? _d : 0) - 3;
    const INT = ((_e = stats['intelligence']) !== null && _e !== void 0 ? _e : 0) - 3;
    const CHR = ((_f = stats['charisma']) !== null && _f !== void 0 ? _f : 0) - 3;
    // If caller provided a specific mpStat, use that stat; otherwise use the best mental stat.
    const MPSTAT = Math.max(INT, WIS, CHR);
    // const bestMod = Math.max(STR, DEX, CON, INT, WIS, CHR);
    const AC = 5 + DEX;
    const HP = 5 + CON + (5 + WIS);
    const MP = 5 + MPSTAT;
    const dmgMod = Math.max(DEX, STR);
    // expose str/dex/mp modifiers so callers can use the better of the two for attack rolls
    // and use the raw MP stat modifier directly for MP hit calculations.
    return {
        AC,
        HP,
        MP,
        dmgMod,
        strMod: STR,
        dexMod: DEX,
        mpMod: MPSTAT,
        raw: stats,
    };
}
// Thin wrapper: call the single canonical engine (simulateEngine) and discard logs.
function simulateSingle(aBase, bBase, opts) {
    const res = simulateEngine(aBase, bBase, opts);
    return { winner: res.winner, turns: res.turns };
}
function runPairwise(chars, options) {
    var _a, _b, _c, _d;
    const results = {};
    const winners = [];
    for (let i = 0; i < chars.length; i++) {
        for (let j = i + 1; j < chars.length; j++) {
            const a = chars[i];
            const b = chars[j];
            const key = `${a.name} vs ${b.name}`;
            results[key] = { aWins: 0, bWins: 0, draws: 0, turns: [] };
            for (let t = 0; t < options.trials; t++) {
                const res = simulateSingle(a, b, options);
                if (res.winner === a.name) {
                    results[key].aWins++;
                    winners.push(a.raw || ((_a = a.derived) === null || _a === void 0 ? void 0 : _a.raw) || ((_b = a.derived) === null || _b === void 0 ? void 0 : _b.rawStats) || a);
                }
                else if (res.winner === b.name) {
                    results[key].bWins++;
                    winners.push(b.raw || ((_c = b.derived) === null || _c === void 0 ? void 0 : _c.raw) || ((_d = b.derived) === null || _d === void 0 ? void 0 : _d.rawStats) || b);
                }
                else
                    results[key].draws++;
                results[key].turns.push(res.turns);
            }
        }
    }
    return { results, winners };
}
// Canonical engine that produces logs. Other entry points may call this and discard logs.
function simulateEngine(aBase, bBase, opts) {
    const log = [];
    const a = {
        name: aBase.name || 'unknown',
        AC: aBase.derived.AC,
        hp: aBase.derived.HP,
        mp: aBase.derived.MP,
        dmgMod: aBase.derived.dmgMod,
        defend: false,
        evade: false,
        down: false,
        stabilized: false,
        deathFails: 0,
        protectCount: 0,
        mpShieldCount: 0,
    };
    const b = {
        name: bBase.name || 'unknown',
        AC: bBase.derived.AC,
        hp: bBase.derived.HP,
        mp: bBase.derived.MP,
        dmgMod: bBase.derived.dmgMod,
        defend: false,
        evade: false,
        down: false,
        stabilized: false,
        deathFails: 0,
        protectCount: 0,
        mpShieldCount: 0,
    };
    const immediateLossOnZero = opts.immediateLoss === true;
    log.push(`=== START: ${a.name} vs ${b.name} (HP ${a.hp} / ${b.hp}, MP ${a.mp} / ${b.mp}) ===`);
    let turn = 0;
    while (turn < opts.maxTurns) {
        turn++;
        log.push(`-- Turn ${turn} --`);
        if (!a.down)
            actionWithLog(a, b, aBase.derived, opts, log);
        if (immediateLossOnZero) {
            if (b.hp <= 0) {
                log.push(`Winner: ${a.name} (ended after turn ${turn})`);
                return { winner: a.name, turns: turn, log };
            }
        }
        if (!b.down)
            actionWithLog(b, a, bBase.derived, opts, log);
        if (immediateLossOnZero) {
            if (a.hp <= 0) {
                log.push(`Winner: ${b.name} (ended after turn ${turn})`);
                return { winner: b.name, turns: turn, log };
            }
        }
        handleDeathSaveLogging(a, opts, log);
        handleDeathSaveLogging(b, opts, log);
        if (a.deathFails >= 3) {
            log.push(`${a.name} died (3 failed death-saves)`);
            return { winner: b.name, turns: turn, log };
        }
        if (b.deathFails >= 3) {
            log.push(`${b.name} died (3 failed death-saves)`);
            return { winner: a.name, turns: turn, log };
        }
    }
    log.push('Result: draw (max turns reached)');
    return { winner: 'draw', turns: opts.maxTurns, log };
    function actionWithLog(actor, target, actorDerived, options, out) {
        var _a;
        if (actor.down)
            return;
        const r = Math.random();
        const mpProb = (_a = options.mpUsageProb) !== null && _a !== void 0 ? _a : DEFAULTS.mpUsageProb;
        // Determine the physical attack modifier (best of STR/DEX as exposed by dmgMod)
        const physMod = Math.max(actorDerived.dmgMod || 0, actorDerived.dexMod || 0);
        // Prefer MP when the MP modifier is strictly better than the physical modifier.
        const preferMP = actor.mp > 0 && (actorDerived.mpMod || 0) > physMod;
        // Choose exactly one action for this turn. Priority: preferMP -> randomized MP -> defend -> evade -> attack
        let chosen;
        if (preferMP)
            chosen = 'mp';
        else if (actor.mp > 0 && r < mpProb)
            chosen = 'mp';
        else if (r >= mpProb && r < mpProb + 0.05)
            chosen = 'defend';
        else if (r >= mpProb + 0.05 && r < mpProb + 0.1)
            chosen = 'evade';
        else
            chosen = 'attack';
        if (chosen === 'mp') {
            if (actor.mp <= 0) {
                out.push(`${actor.name} tried to use MP but had none`);
                return;
            }
            // Spend 1 MP to perform an MP-augmented offensive attack.
            // This uses the MP-use modifier (best of INT/WIS/CHA) + a flat +1 to hit.
            actor.mp = Math.max(0, actor.mp - 1);
            // grant one-use MP shield that halves the next incoming damage (still considered part of the single MP action)
            actor.mpShieldCount = Math.max(actor.mpShieldCount || 0, 0) + 1;
            out.push(`${actor.name} spends 1 MP to make an MP-attack (MP left=${actor.mp}); MP-shield granted (1 incoming hit will be halved)`);
            // perform an MP-attack (uses mpMod+1)
            let attackRoll = rollD10();
            if (target.evade) {
                const r1 = rollD10();
                const r2 = rollD10();
                attackRoll = Math.min(r1, r2);
                out.push(`${actor.name} MP-attacks (evade penalty -> min(${r1},${r2})=${attackRoll})`);
            }
            else {
                out.push(`${actor.name} MP-attacks (roll ${attackRoll})`);
            }
            const attackMod = (actorDerived.mpMod || 0) + 1; // mpMod plus flat +1
            const attackTotal = attackRoll + attackMod;
            const hit = attackTotal > target.AC;
            out.push(`  MP-attack total ${attackRoll}+mpMod+1 ${attackMod} = ${attackTotal} vs AC ${target.AC} => ${hit ? 'HIT' : 'MISS'}`);
            if (hit) {
                const bestOff = actorDerived.mpMod;
                let dmg = 1 + bestOff;
                // If target was defending or has an MP-shield, halve damage once.
                let mpShieldUsed = false;
                if (target.mpShieldCount && target.mpShieldCount > 0) {
                    dmg = Math.floor(dmg / 2);
                    mpShieldUsed = true;
                    target.mpShieldCount = Math.max(0, target.mpShieldCount - 1);
                }
                else if (target.defend) {
                    dmg = Math.floor(dmg / 2);
                }
                localApplyDamage(target, dmg);
                out.push(`  -> ${actor.name} deals ${dmg} damage to ${target.name} (HP now ${target.hp})`);
                if (mpShieldUsed) {
                    out.push(`${target.name}'s MP-shield consumed (remaining ${target.mpShieldCount})`);
                }
                target.defend = false;
                target.evade = false;
            }
            return;
        }
        if (chosen === 'defend') {
            actor.defend = true;
            actor.evade = false;
            out.push(`${actor.name} takes a defensive stance`);
            return;
        }
        if (chosen === 'evade') {
            actor.evade = true;
            actor.defend = false;
            out.push(`${actor.name} attempts to evade`);
            return;
        }
        let attackRoll = rollD10();
        // If the target is evading, the attacker suffers disadvantage: take min of two d10 rolls.
        if (target.evade) {
            const r1 = rollD10();
            const r2 = rollD10();
            attackRoll = Math.min(r1, r2);
            out.push(`${actor.name} attacks (evade penalty -> min(${r1},${r2})=${attackRoll})`);
        }
        else {
            out.push(`${actor.name} attacks (roll ${attackRoll})`);
        }
        const attackMod = Math.max(actorDerived.dmgMod || 0, actorDerived.dexMod || 0);
        const attackTotal = attackRoll + attackMod;
        const hit = attackTotal > target.AC;
        out.push(`  attack total ${attackRoll}+atkMod ${attackMod} = ${attackTotal} vs AC ${target.AC} => ${hit ? 'HIT' : 'MISS'}`);
        if (hit) {
            let dmg = Math.max(1, 1 + actor.dmgMod);
            if (target.defend)
                dmg = Math.floor(dmg / 2);
            localApplyDamage(target, dmg);
            out.push(`  -> ${actor.name} deals ${dmg} damage to ${target.name} (HP now ${target.hp})`);
            target.defend = false;
            target.evade = false;
        }
    }
    function localApplyDamage(target, dmg) {
        target.hp -= dmg;
        if (target.hp <= 0)
            target.down = true;
    }
    function handleDeathSaveLogging(character, options, out) {
        if (!character.down)
            return;
        const roll = rollD10();
        if (options.immediateLoss === true) {
            out.push(`${character.name} is down; immediate loss mode => no death-save`);
        }
        else {
            out.push(`${character.name} death-save roll: ${roll}`);
            if (roll > 5) {
                character.stabilized = true;
                character.down = true;
                character.hp = 0;
                out.push(`${character.name} stabilized (out of fight)`);
            }
            else {
                character.deathFails += 1;
                out.push(`${character.name} failed death-save (${character.deathFails}/3)`);
            }
        }
    }
}
function summarize(results) {
    const summary = [];
    for (const [k, v] of Object.entries(results)) {
        const avgTurns = v.turns.reduce((s, x) => s + x, 0) /
            (v.turns.length || 1);
        summary.push({
            matchup: k,
            aWins: v.aWins,
            bWins: v.bWins,
            draws: v.draws,
            avgTurns: avgTurns.toFixed(1),
        });
    }
    return summary;
}
function main() {
    var _a, _b, _c;
    const charsRaw = readCharacters();
    if (charsRaw.length === 0) {
        console.error('No characters parsed from', CHAR_FILE);
        process.exit(1);
    }
    const argv = process.argv.slice(2);
    const trialsArg = Number(argv[0]) || 100;
    const trials = Math.max(1, Math.min(2000, trialsArg));
    const immediate = DEFAULTS.immediateLoss; // use immediate loss for speed and consistency
    const mpstat = DEFAULTS.mpStat;
    const chars = charsRaw.map((c) => {
        // apply ability (+) and weakness (-) adjustments to a copy of stats
        const adjusted = { ...(c.stats || {}) };
        try {
            if (c.ability &&
                c.ability.statAffecting &&
                typeof c.ability.statValue === 'number') {
                const key = c.ability.statAffecting;
                adjusted[key] = (adjusted[key] || 0) + c.ability.statValue;
            }
            if (c.weakness &&
                c.weakness.statAffecting &&
                typeof c.weakness.statValue === 'number') {
                const key = c.weakness.statAffecting;
                adjusted[key] = (adjusted[key] || 0) - c.weakness.statValue;
            }
        }
        catch {
            // ignore any malformed ability/weakness entries
        }
        return {
            name: c.name,
            derived: deriveStats(adjusted, { mpStat: mpstat }),
            raw: adjusted,
            ability: c.ability,
            weakness: c.weakness,
        };
    });
    // If user requested a detailed log for a single character, run a few sample fights and print logs.
    const logIndex = argv.indexOf('--log');
    if (logIndex !== -1) {
        const name = argv[logIndex + 1];
        if (!name) {
            console.error('Usage: --log <CharacterName>');
            process.exit(1);
        }
        const subject = chars.find((x) => x.name === name ||
            String(x.name).toLowerCase() === String(name).toLowerCase());
        if (!subject) {
            console.error('Character not found:', name);
            process.exit(1);
        }
        const pool = chars.filter((x) => x.name !== subject.name);
        if (pool.length === 0) {
            console.error('No opponents available to log against.');
            process.exit(1);
        }
        console.log(`Logging sample fights for ${subject.name} vs random opponents:`);
        for (let i = 0; i < 3; i++) {
            const opp = pool[randInt(0, pool.length - 1)];
            const res = simulateEngine(subject, opp, {
                maxTurns: DEFAULTS.maxTurns,
                immediateLoss: immediate,
                mpUsageProb: DEFAULTS.mpUsageProb,
            });
            console.log('\n=== SAMPLE FIGHT ' + (i + 1) + ' ===');
            console.log(res.log.join('\n'));
        }
        return;
    }
    console.log(`Parsed ${chars.length} characters. Running pairwise ${trials} trials per match (immediateLoss=${immediate})`);
    // Run pairwise across the full roster (user requested full ranking)
    const { results, winners } = runPairwise(chars, {
        trials,
        maxTurns: DEFAULTS.maxTurns,
        immediateLoss: immediate,
        mpUsageProb: DEFAULTS.mpUsageProb,
    });
    const summary = summarize(results);
    summary.sort((a, b) => b.aWins + b.bWins - (a.aWins + a.bWins));
    // Instead of dumping every matchup row, show only aggregated/interesting summaries
    // Global average turn count
    const allTurns = Object.values(results).flatMap((v) => v.turns);
    const globalAvgTurns = allTurns.reduce((s, x) => s + x, 0) /
        (allTurns.length || 1);
    // Top 10 longest matchups by avg turns
    const longest = [...summary]
        .sort((a, b) => Number(b.avgTurns) - Number(a.avgTurns))
        .slice(0, 10);
    console.log(`\nGlobal average turns per match: ${globalAvgTurns.toFixed(2)}`);
    console.log('\nTop 10 longest matchups by average turn length:');
    console.table(longest);
    const aggregate = {};
    for (const s of summary) {
        const parts = s.matchup.split(' vs ');
        const aName = parts[0];
        const bName = parts[1];
        aggregate[aName] = aggregate[aName] || {
            wins: 0,
            games: 0,
            totalTurns: 0,
            countMatches: 0,
        };
        aggregate[bName] = aggregate[bName] || {
            wins: 0,
            games: 0,
            totalTurns: 0,
            countMatches: 0,
        };
        aggregate[aName].wins += s.aWins;
        aggregate[aName].games += s.aWins + s.bWins + s.draws;
        aggregate[bName].wins += s.bWins;
        aggregate[bName].games += s.aWins + s.bWins + s.draws;
    }
    // attach average turn info per character
    for (const [k, v] of Object.entries(results)) {
        const parts = k.split(' vs ');
        const a = parts[0];
        const b = parts[1];
        const avg = v.turns.reduce((s, x) => s + x, 0) /
            (v.turns.length || 1);
        aggregate[a] = aggregate[a] || {
            wins: 0,
            games: 0,
            totalTurns: 0,
            countMatches: 0,
        };
        aggregate[b] = aggregate[b] || {
            wins: 0,
            games: 0,
            totalTurns: 0,
            countMatches: 0,
        };
        aggregate[a].totalTurns = (aggregate[a].totalTurns || 0) + avg;
        aggregate[a].countMatches =
            (aggregate[a].countMatches || 0) + 1;
        aggregate[b].totalTurns = (aggregate[b].totalTurns || 0) + avg;
        aggregate[b].countMatches =
            (aggregate[b].countMatches || 0) + 1;
    }
    const ranks = Object.entries(aggregate).map(([n, d]) => ({
        name: n,
        winRate: d.wins / d.games || 0,
        avgTurns: d.totalTurns && d.countMatches
            ? d.totalTurns / d.countMatches
            : undefined,
    }));
    ranks.sort((x, y) => y.winRate - x.winRate);
    console.log('\nPerformers by aggregate win-rate (all characters):');
    console.table(ranks);
    // Analyze winners' stat spreads
    const statKeys = [
        'strength',
        'dexterity',
        'constitution',
        'intelligence',
        'wisdom',
        'charisma',
        'luck',
    ];
    const statAcc = {};
    for (const k of statKeys)
        statAcc[k] = [];
    const spreadCounts = {};
    for (const w of winners) {
        const parts = [];
        for (const k of statKeys) {
            const v = (_a = w[k]) !== null && _a !== void 0 ? _a : 0;
            statAcc[k].push(v);
            parts.push(String(v));
        }
        const key = parts.join(',');
        spreadCounts[key] = (spreadCounts[key] || 0) + 1;
    }
    const statSummary = {};
    for (const k of statKeys) {
        const arr = statAcc[k].slice().sort((a, b) => a - b);
        const mean = arr.reduce((s, x) => s + x, 0) / (arr.length || 1);
        const mid = Math.floor(arr.length / 2);
        const median = arr.length % 2 === 1 ? arr[mid] : (arr[mid - 1] + (arr[mid] || 0)) / 2;
        statSummary[k] = { mean, median };
    }
    const topSpreads = Object.entries(spreadCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([k, v]) => ({ spread: k, count: v }));
    console.log('\nWinners stat summary (post ability/weakness adjustments):');
    console.table(statSummary);
    console.log('\nTop common stat spreads among winners (count):');
    console.table(topSpreads);
    // New: show overrepresentation of stat values among winners vs roster baseline.
    // For each stat, compare frequency of stat=value in winners vs frequency in full character roster.
    const rosterCounts = {};
    for (const k of statKeys)
        rosterCounts[k] = {};
    for (const c of chars) {
        for (const k of statKeys) {
            const v = (_b = c.raw[k]) !== null && _b !== void 0 ? _b : 0;
            rosterCounts[k][v] = (rosterCounts[k][v] || 0) + 1;
        }
    }
    const winnerCounts = {};
    for (const k of statKeys)
        winnerCounts[k] = {};
    for (const w of winners) {
        for (const k of statKeys) {
            const v = (_c = w[k]) !== null && _c !== void 0 ? _c : 0;
            winnerCounts[k][v] = (winnerCounts[k][v] || 0) + 1;
        }
    }
    console.log('\nStat overrepresentation among winners (compared to roster).');
    console.log('Columns: stat | offset | value | winner% (cumulative) | roster% (cumulative) | diff%pts | mult_vs_baseline');
    for (const k of statKeys) {
        const lines = [];
        const totalW = winners.length || 1;
        const totalR = chars.length || 1;
        // baseline counts for value 3
        const baseVal = 3;
        const baseW = winnerCounts[k][baseVal] || 0;
        const baseR = rosterCounts[k][baseVal] || 0;
        const baseRatio = baseR === 0 ? null : baseW / totalW / (baseR / totalR);
        // show offsets from -3..+3 around base 3 for readability, but skip baseline offset 0
        for (let off = -3; off <= 3; off++) {
            if (off === 0)
                continue;
            const val = 3 + off;
            // Use cumulative counting: for values above baseline, include all winners/roster with stat >= val;
            // for values below baseline, include all with stat <= val. This makes +3 include +2/+1 wins.
            const MIN_STAT = 0;
            const MAX_STAT = 6;
            let wc = 0;
            let rc = 0;
            if (val > baseVal) {
                for (let s = val; s <= MAX_STAT; s++) {
                    wc += winnerCounts[k][s] || 0;
                    rc += rosterCounts[k][s] || 0;
                }
            }
            else {
                for (let s = MIN_STAT; s <= val; s++) {
                    wc += winnerCounts[k][s] || 0;
                    rc += rosterCounts[k][s] || 0;
                }
            }
            const wPct = (wc / totalW) * 100;
            const rPct = (rc / totalR) * 100;
            let multVsBaseline;
            if (rc === 0 || baseRatio === null) {
                multVsBaseline = 'N/A';
            }
            else {
                const ratioVal = wc / totalW / (rc / totalR);
                const mult = ratioVal / baseRatio;
                multVsBaseline = mult.toFixed(2) + 'x';
            }
            const diffPct = wPct - rPct;
            lines.push({
                stat: k,
                offset: off,
                value: val,
                winnerPct: wPct.toFixed(2) + '%',
                rosterPct: rPct.toFixed(2) + '%',
                diffPct: (diffPct >= 0 ? '+' : '') + diffPct.toFixed(2) + 'pp',
                multVsBaseline,
            });
        }
        console.table(lines);
    }
}
if (require.main === module)
    main();
