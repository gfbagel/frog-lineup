import {
  Character,
  Rank,
  StatMod,
} from '../character-details/character-details.component';

export const characterList: Character[] = [
  {
    img: 'Akumu.PNG',
    name: 'Akumu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    height: 24,
    serviceYrs: 0,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Bucklolo.PNG',
    name: 'Bucklolo',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 1,
    height: 12,
    rank: Rank.PRIVATE_1ST,
    isActiveService: true,
  },
  {
    img: 'Bulolo.PNG',
    name: 'Bulolo',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 9,
    height: 22,
    rank: Rank.CORPORAL_LANCE,
    isActiveService: false,
  },
  {
    img: 'Curoro.PNG',
    name: 'Curoro',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 12,
    height: 19,
    rank: Rank.SERGEANT,
    isActiveService: false,
  },
  {
    img: 'Dalalu.PNG',
    name: 'Dalalu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 12,
    height: 24,
    rank: Rank.OFFICER_WARRANT,
    isActiveService: true,
  },
  {
    img: 'Dangaga.PNG',
    name: 'Dangaga',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 15,
    height: 36,
    rank: Rank.SERGEANT_MAJOR,
    isActiveService: true,
  },
  {
    img: 'Deromo.PNG',
    name: 'Deromo',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 12,
    height: 20,
    rank: Rank.SERGEANT_MAJOR,
    isActiveService: false,
  },
  {
    img: 'Gadodo.PNG',
    name: 'Gadodo',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 28,
    height: 21,
    rank: Rank.MAJOR,
    isActiveService: false,
  },
  {
    img: 'Gosusu.PNG',
    name: 'Gosusu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 19,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Grahm.PNG',
    name: 'Grahm',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 21,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Grododu.PNG',
    name: 'Grododu',
    description: '',
    ability: {
      name: 'Genius',
      description: '',
      statAffecting: 'intelligence',
      statValue: 1,
      statModifier: StatMod.ADD,
    },
    weakness: {
      name: 'Disfigured',
      description: '',
      statAffecting: 'dexterity',
      statValue: 1,
      statModifier: StatMod.SUBTRACT,
    },
    stats: {
      strength: 2,
      dexterity: 2,
      constitution: 3,
      intelligence: 6,
      wisdom: 4,
      charisma: 3,
      luck: 5,
    },
    age: 0,
    serviceYrs: 6,
    height: 270,
    rank: Rank.CORPORAL,
    isActiveService: true,
  },
  {
    img: 'Hitoto.PNG',
    name: 'Hitoto',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 10,
    height: 19,
    rank: Rank.CORPORAL_LANCE,
    isActiveService: true,
  },
  {
    img: 'Jamimi.PNG',
    name: 'Jamimi',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 6,
    height: 22,
    rank: Rank.CORPORAL_LANCE,
    isActiveService: false,
  },
  {
    img: 'Jomara.PNG',
    name: 'Jomara',

    description: '',
    ability: {
      name: 'Test Subject',
      description: '',
      statAffecting: 'strength',
      statValue: 1,
      statModifier: StatMod.ADD,
    },
    weakness: {
      name: 'Hasty',
      description: '',
      statAffecting: 'wisdom',
      statValue: 1,
      statModifier: StatMod.SUBTRACT,
    },
    stats: {
      strength: 6,
      dexterity: 3,
      constitution: 4,
      intelligence: 3,
      wisdom: 3,
      charisma: 2,
      luck: 3,
    },
    age: 0,
    serviceYrs: 5,
    height: 19,
    rank: Rank.CORPORAL,
    isActiveService: true,
  },
  {
    img: 'Keroro.PNG',
    name: 'Keroro',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 20,
    rank: Rank.SERGEANT,
    isActiveService: true,
  },
  {
    img: 'Kiki.PNG',
    name: 'Kiki',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 18,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Knightenbottom.PNG',
    name: 'Knightenbottom',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 17,
    rank: Rank.NONE,
    isActiveService: true,
  },
  {
    img: 'Kujijil.PNG',
    name: 'Kujiji',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 30,
    height: 21,
    rank: Rank.SERGEANT_MAJOR,
    isActiveService: true,
  },
  {
    img: 'Kyohehe.PNG',
    name: 'Kyohehe',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 30,
    height: 23,
    rank: Rank.SERGEANT,
    isActiveService: true,
  },
  {
    img: 'Lyudidi.PNG',
    name: 'Lyudidi',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 9,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Murama.PNG',
    name: 'Murama',

    description: '',
    ability: {
      name: 'Test Subject',
      description: '',
      statAffecting: 'constitution',
      statValue: 1,
      statModifier: StatMod.ADD,
    },
    weakness: {
      name: 'Idiot',
      description: '',
      statAffecting: 'intellegence',
      statValue: 1,
      statModifier: StatMod.SUBTRACT,
    },
    stats: {
      strength: 4,
      dexterity: 3,
      constitution: 6,
      intelligence: 2,
      wisdom: 4,
      charisma: 4,
      luck: 1,
    },
    age: 0,
    serviceYrs: 5,
    height: 19,
    rank: Rank.CORPORAL_LANCE,
    isActiveService: true,
  },
  {
    img: 'Murara.PNG',
    name: 'Murara',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 8,
    height: 19,
    rank: Rank.CORPORAL,
    isActiveService: false,
  },
  {
    img: 'Nanami.PNG',
    name: 'Nanami',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 1,
    height: 19,
    rank: Rank.PRIVATE_3RD,
    isActiveService: true,
  },
  {
    img: 'Nenamo.PNG',
    name: 'Nenamo',

    description: '',
    ability: {
      name: 'Attuned',
      description: '',
      statAffecting: 'wisdom',
      statValue: 1,
      statModifier: StatMod.ADD,
    },
    weakness: {
      name: 'Stunted',
      description: '',
      statAffecting: 'strength',
      statValue: 1,
      statModifier: StatMod.SUBTRACT,
    },
    stats: {
      strength: 2,
      dexterity: 5,
      constitution: 2,
      intelligence: 3,
      wisdom: 6,
      charisma: 3,
      luck: 3,
    },
    age: 0,
    serviceYrs: 8,
    height: 25,
    rank: Rank.CORPORAL,
    isActiveService: true,
  },
  {
    img: 'Rizizu.PNG',
    name: 'Rizizu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 8,
    height: 16,
    rank: Rank.SERGEANT,
    isActiveService: true,
  },
  {
    img: 'Romeme.PNG',
    name: 'Romeme',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 36,
    height: 20,
    rank: Rank.MAJOR,
    isActiveService: true,
  },
  {
    img: 'Ronana.PNG',
    name: 'Ronana',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 27,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Scototo.PNG',
    name: 'Scototo',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 19,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Shadudu.PNG',
    name: 'Shadudu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 29,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Shibibi.PNG',
    name: 'Shibibi',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 17,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Tenbu.PNG',
    name: 'Tenbu',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 20,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Teruru.PNG',
    name: 'Teruru',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 28,
    height: 18,
    rank: Rank.LIEUTENANT_2ND,
    isActiveService: true,
  },
  {
    img: 'Tikoko.PNG',
    name: 'Tikoko',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 10,
    height: 16,
    rank: Rank.CORPORAL,
    isActiveService: true,
  },
  {
    img: 'Ulerara.PNG',
    name: 'Ulerara',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0.5,
    height: 20,
    rank: Rank.PRIVATE_IN_TRAINING,
    isActiveService: true,
  },
  {
    img: 'Usagi.PNG',
    name: 'Usagi',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 20,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Xenono.PNG',
    name: 'Xenono',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 18,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Xi.PNG',
    name: 'Xi',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 20,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Yamoro.PNG',
    name: 'Yamoro',
    description: '',
    ability: {
      name: 'Authoritative',
      description: '',
      statAffecting: 'charisma',
      statValue: 1,
      statModifier: StatMod.ADD,
    },
    weakness: {
      name: 'Alcoholic',
      description: '',
      statAffecting: 'constitution',
      statValue: 1,
      statModifier: StatMod.SUBTRACT,
    },
    stats: {
      strength: 3,
      dexterity: 3,
      constitution: 3,
      intelligence: 4,
      wisdom: 4,
      charisma: 6,
      luck: 1,
    },
    age: 0,
    serviceYrs: 0,
    height: 17,
    rank: Rank.SERGEANT_MAJOR,
    isActiveService: true,
  },
  {
    img: 'Yonana.PNG',
    name: 'Yonana',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 11,
    height: 16,
    rank: Rank.CAPTAIN,
    isActiveService: false,
  },
  {
    img: 'Yotaku.PNG',
    name: 'Yotaku',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 23,
    rank: Rank.NONE,
    isActiveService: false,
  },
  {
    img: 'Zyena.PNG',
    name: 'Zyena',
    description: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      luck: 0,
    },
    age: 0,
    serviceYrs: 0,
    height: 18,
    rank: Rank.NONE,
    isActiveService: false,
  },
];
