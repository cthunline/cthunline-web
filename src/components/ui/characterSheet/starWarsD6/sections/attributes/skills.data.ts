import {
    SWD6Skill,
    SWD6Attribute
} from '../../../../../../types/games/starWarsD6';

export interface SkillField {
    gridColumn: number;
    key: keyof SWD6Skill;
}

export const skillFields: SkillField[] = [{
    gridColumn: 11,
    key: 'name'
}, {
    gridColumn: 5,
    key: 'value'
}];

type SkillList = Record<SWD6Attribute, string[]>;

export const defaultSkillData = {
    name: '',
    value: ''
};

export const skillList: SkillList = {
    dexterity: [
        'Archaic guns',
        'Blaster',
        'Blaster artillery',
        'Bowcaster',
        'Brawling parry',
        'Dodge',
        'Firearms',
        'Grenade',
        'Lightsaber',
        'Melee combat',
        'Melee parry',
        'Missile weapons',
        'Pick pocket',
        'Running',
        'Thrown weapons',
        'Vehicle blasters'
    ],
    knowledge: [
        'Alien species',
        'Bureaucracy',
        'Business',
        'Cultures',
        'Intimidation',
        'Languages',
        'Law enforcement',
        'Planetary systems',
        'Scholar',
        'Streetwise',
        'Survival',
        'Tactics',
        'Value',
        'Willpower'
    ],
    mechanical: [
        'Archaic starship piloting',
        'Astrogation',
        'Beast riding',
        'Capital ship gunnery',
        'CApital ship piloting',
        'Capital ship shields',
        'Communications',
        'Ground vehicle operation',
        'Hover vehicle operation',
        'Jet pack operation',
        'Powersuit operation',
        'Repulsorlift operation',
        'Rocket pack operation',
        'Sensors',
        'Space transports',
        'Starfighter piloting',
        'Starship piloting',
        'Starship gunnery',
        'Starship shields',
        'Swoop operation',
        'Walker operation'
    ],
    perception: [
        'Bargain',
        'Command',
        'Con',
        'Forgery',
        'Gambling',
        'Hide',
        'Investigation',
        'Persuasion',
        'Search',
        'Sneak'
    ],
    strength: [
        'Brawling',
        'Climbing / jumping',
        'Lifting',
        'Stamina',
        'Swimming'
    ],
    technical: [
        'Armor repair',
        'Blaster repair',
        'Capital ship repair',
        'Capital ship weapon repair',
        'Computer programming / repair',
        'Demolitions',
        'Droid programming',
        'Droid repair',
        'First aid',
        'Ground vehicle repair',
        'Hover vehicle repair',
        'Medicine',
        'Repulsorlift repair',
        'Security',
        'Space transports repair',
        'Starfighter repair',
        'Starship weapon repair',
        'Walker repair'
    ]
};
