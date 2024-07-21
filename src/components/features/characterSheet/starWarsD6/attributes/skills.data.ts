import type { SWD6Attribute, SWD6Skill } from '@cthunline/games';

export interface SkillField {
    gridColumn: number;
    key: keyof SWD6Skill;
}

export const skillFields: SkillField[] = [
    {
        gridColumn: 11,
        key: 'name'
    },
    {
        gridColumn: 5,
        key: 'value'
    }
];

type SkillList = Record<SWD6Attribute, string[]>;

export const defaultSkillData = {
    name: '',
    value: ''
};

export const skillList: SkillList = {
    dexterity: [
        'archaicGuns',
        'blaster',
        'blasterArtillery',
        'bow',
        'bowcaster',
        'brawlingParry',
        'dodge',
        'firearms',
        'grenade',
        'lightsaber',
        'meleeCombat',
        'meleeParry',
        'missileWeapons',
        'pickPocket',
        'running',
        'thrownWeapons',
        'vehicleBlasters'
    ],
    knowledge: [
        'alienSpecies',
        'bureaucracy',
        'business',
        'cultures',
        'intimidation',
        'languages',
        'lawEnforcement',
        'planetarySystems',
        'scholar',
        'streetwise',
        'survival',
        'tactics',
        'value',
        'willpower'
    ],
    mechanical: [
        'archaicStarshipPiloting',
        'astrogation',
        'beastRiding',
        'capitalShipGunnery',
        'capitalShipPiloting',
        'capitalShipShields',
        'communications',
        'groundVehicleOperation',
        'hoverVehicleOperation',
        'jetPackOperation',
        'powersuitOperation',
        'repulsorliftOperation',
        'rocketPackOperation',
        'sensors',
        'spaceTransports',
        'starfighterPiloting',
        'starshipPiloting',
        'starshipGunnery',
        'starshipShields',
        'swoopOperation',
        'walkerOperation'
    ],
    perception: [
        'bargain',
        'command',
        'con',
        'forgery',
        'gambling',
        'hide',
        'investigation',
        'persuasion',
        'search',
        'sneak'
    ],
    strength: ['brawling', 'climbingJumping', 'lifting', 'stamina', 'swimming'],
    technical: [
        'armorRepair',
        'blasterRepair',
        'capitalShipRepair',
        'capitalShipWeaponRepair',
        'computerProgrammingRepair',
        'demolitions',
        'droidProgramming',
        'droidRepair',
        'firstAid',
        'groundVehicleRepair',
        'hoverVehicleRepair',
        'medicine',
        'repulsorliftRepair',
        'security',
        'spaceTransportsRepair',
        'starfighterRepair',
        'starshipWeaponRepair',
        'walkerRepair'
    ]
};
