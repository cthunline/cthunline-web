import type {
    WarhammerFantasyAmbitions,
    WarhammerFantasyBiography,
    WarhammerFantasyExperience,
    WarhammerFantasyFate,
    WarhammerFantasyMovement,
    WarhammerFantasyParty,
    WarhammerFantasyResilience,
    WarhammerFantasyWealth,
    WarhammerFantasyWounds
} from '@cthunline/games';

import type { Field } from '../generic/fieldLayout/FieldLayout.js';

export const biographyFields: Field<WarhammerFantasyBiography>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        key: 'species',
        gridColumn: 3
    },
    {
        key: 'class',
        gridColumn: 3
    },
    {
        key: 'career',
        gridColumn: 6
    },
    {
        key: 'careerLevel',
        gridColumn: 6
    },
    {
        key: 'careerPath',
        gridColumn: 8
    },
    {
        key: 'status',
        gridColumn: 4
    },
    {
        key: 'age',
        gridColumn: 3
    },
    {
        key: 'height',
        gridColumn: 3
    },
    {
        key: 'hair',
        gridColumn: 3
    },
    {
        key: 'eyes',
        gridColumn: 3
    }
];

export const fateFields: Field<WarhammerFantasyFate>[] = [
    {
        key: 'fate',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'fortune',
        type: 'number',
        gridColumn: 12
    }
];

export const resilienceFields: Field<WarhammerFantasyResilience>[] = [
    {
        key: 'resilience',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'resolve',
        type: 'number',
        gridColumn: 12
    }
];

export const experienceFields: Field<WarhammerFantasyExperience>[] = [
    {
        key: 'current',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'spent',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'total',
        type: 'number',
        gridColumn: 12,
        readonly: true
    }
];

export const movementFields: Field<WarhammerFantasyMovement>[] = [
    {
        key: 'movement',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'walk',
        type: 'number',
        gridColumn: 12,
        readonly: true
    },
    {
        key: 'run',
        type: 'number',
        gridColumn: 12,
        readonly: true
    }
];

export const ambitionsFields: Field<WarhammerFantasyAmbitions>[] = [
    {
        key: 'shortTerm',
        gridColumn: 12,
        lines: 5
    },
    {
        key: 'longTerm',
        gridColumn: 12,
        lines: 5
    }
];

export const partyFields: Field<WarhammerFantasyParty>[] = [
    {
        key: 'name',
        gridColumn: 12
    },
    {
        key: 'shortTerm',
        gridColumn: 12,
        lines: 2
    },
    {
        key: 'longTerm',
        gridColumn: 12,
        lines: 2
    },
    {
        key: 'members',
        gridColumn: 12,
        lines: 3
    }
];

export const wealthFields: Field<WarhammerFantasyWealth>[] = [
    {
        key: 'brassPennies',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'silverShillings',
        type: 'number',
        gridColumn: 12
    },
    {
        key: 'goldCrowns',
        type: 'number',
        gridColumn: 12
    }
];

export const woundsFields: Field<WarhammerFantasyWounds>[] = [
    {
        gridColumn: 12,
        children: [
            {
                key: 'strengthBonus',
                gridColumn: 6,
                readonly: true
            },
            {
                key: 'twiceToughnessBonus',
                gridColumn: 6,
                readonly: true
            },
            {
                key: 'willpowerBonus',
                gridColumn: 6,
                readonly: true
            },
            {
                key: 'hardy',
                gridColumn: 6,
                type: 'boolean'
            },
            {
                key: 'total',
                gridColumn: 6,
                readonly: true
            },
            {
                key: 'current',
                type: 'number',
                gridColumn: 6
            }
        ]
    },
    {
        key: 'notes',
        gridColumn: 12,
        lines: 3
    }
];
