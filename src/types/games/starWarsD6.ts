export interface SWD6CharacterData {
    portrait: string;
    biography: SWD6Biography;
    attributes: SWD6Attributes;
    abilities: string[];
    statistics: SWD6Statistics;
    woundStatus: SWD6WoundStatus;
    weapons: SWD6Weapon[];
    story: SWD6Story;
}

export interface SWD6Biography {
    name: string;
    occupation: string;
    species: string;
    age: number;
    height: string;
    weight: string;
    description: string;
}

export interface SWD6Attributes {
    dexterity: SWD6AttributeData;
    knowledge: SWD6AttributeData;
    mechanical: SWD6AttributeData;
    perception: SWD6AttributeData;
    strength: SWD6AttributeData;
    technical: SWD6AttributeData;
}

export type SWD6Attribute = keyof SWD6Attributes;

export interface SWD6AttributeData {
    value: string;
    skills: SWD6Skill[];
}

export interface SWD6Skill {
    name: string;
    value: string;
}

export interface SWD6Statistics {
    move: number;
    forceSensitive: boolean;
    forcePoints: number;
    darkSidePoints: number;
    characterPoints: number;
}

export interface SWD6WoundStatus {
    stunned: boolean;
    wounded: boolean;
    doublyWounded: boolean;
    incapacitated: boolean;
    mortallyWounded: boolean;
}

export type SWD6WoundStatusKey = keyof SWD6WoundStatus;

export interface SWD6Story {
    equipment: string;
    background: string;
    personality: string;
    objectives: string;
    quote: string;
    connections: string;
}

export interface SWD6Weapon {
    name: string;
    damage: string;
    shortRange: string;
    mediumRange: string;
    longRange: string;
    ammo: string;
}
