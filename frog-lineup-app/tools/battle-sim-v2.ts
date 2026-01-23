import { characterList } from '../src/app/art-lineup/characterData';
import { Character } from '../src/app/character-details/character-details.component';
import { Combatant } from './Combatant';

interface Matchup {
  id: string;
  characterA: Character;
  characterB: Character;
}

function generateMatchups(roster: Character[]): Matchup[] {
  const queue: Matchup[] = [];

  for (let i = 0; i < roster.length; i++) {
    for (let j = i + 1; j < roster.length; j++) {
      const p1 = roster[i];
      const p2 = roster[j];

      queue.push({
        id: `${p1.name} vs ${p2.name}`,
        characterA: p1,
        characterB: p2,
      });
    }
  }
  return queue;
}

// 2. The Execution Loop
function runSimulation(roster: Character[], roundsPerMatchup = 100) {
  const schedule = generateMatchups(roster);
  const finalResults: Record<string, { winner: string }[]> = {};

  console.log(`Simulating ${schedule.length} unique matchups...`);

  schedule.forEach((match) => {
    finalResults[match.id] = [];

    for (let r = 0; r < roundsPerMatchup; r++) {
      const fighter1 = new Combatant(match.characterA);
      const fighter2 = new Combatant(match.characterB);

      const result = simulateMatchup(fighter1, fighter2);
      finalResults[match.id].push({ winner: result.winner });
    }
  });

  return finalResults;
}

interface FightLog {
  winner: string;
  turns: number;
  log: string[];
}

function simulateMatchup(
  combatant1: Combatant,
  combatant2: Combatant,
): FightLog {
  const fightLog: string[] = [];
  let turnCount = 0;
  const MAX_TURNS = 100;

  // 50/50 Coin flip for who acts first
  let p1 = Math.random() > 0.5 ? combatant1 : combatant2;
  let p2 = p1 === combatant1 ? combatant2 : combatant1;

  //combat loop
  while (!p1.vitals.isDown && !p2.vitals.isDown && turnCount < MAX_TURNS) {
    turnCount++;
    fightLog.push(`Turn ${turnCount}: ${p1.name} acting...`);
    p1.onTurnStart();
    if (p1.vitals.isDown) break;
    takeTurn(p1, p2, fightLog);
    if (p2.vitals.isDown) break;
    fightLog.push(`Turn ${turnCount}: ${p2.name} acting...`);
    p2.onTurnStart();
    if (p2.vitals.isDown) break;
    takeTurn(p2, p1, fightLog);
  }

  const winner =
    p1.vitals.isDown && !p2.vitals.isDown
      ? p2.name
      : p2.vitals.isDown && !p1.vitals.isDown
        ? p1.name
        : 'DRAW';

  return { winner, turns: turnCount, log: fightLog };
}

function takeTurn(actor: Combatant, target: Combatant, log: string[]) {
  // Simple AI: 25% chance to use MP if available, otherwise Attack
  const roll = Math.random();

  if (actor.vitals.currentMP >= 1 && roll < 0.25) {
    log.push(`${actor.name} casts MP Blast!`);
    actor.performMPAction('MPBLAST', target);
  } else {
    actor.performPhysicalAttack(target, 'strength');
    log.push(`${actor.name} attacks...`);
  }
}

runSimulation(characterList);
