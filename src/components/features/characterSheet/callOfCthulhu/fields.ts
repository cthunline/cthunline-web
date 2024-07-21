import type { CoCBiography, CoCStory } from '@cthunline/games';
import type { Field } from '../generic/fieldLayout/FieldLayout.js';

export const biographyFields: Field<CoCBiography>[] = [
    {
        key: 'name',
        gridColumn: 5
    },
    {
        key: 'occupation',
        gridColumn: 5
    },
    {
        key: 'age',
        type: 'number',
        gridColumn: 2
    },
    {
        key: 'birthPlace',
        gridColumn: 6
    },
    {
        key: 'residence',
        gridColumn: 6
    }
];

export const storyFields: Field<CoCStory>[] = [
    {
        key: 'story',
        gridColumn: 12,
        lines: 5
    },
    {
        key: 'personalDescription',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'traits',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'ideologyAndBeliefs',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'injuriesAndScars',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'significantPeople',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'phobiasAndManias',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'meaningfulLocations',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'arcaneTomesAndSpells',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'treasuredPossessions',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'encountersWithStrangeEntities',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'gearAndPossessions',
        gridColumn: 6,
        lines: 9
    },
    {
        gridColumn: 6,
        children: [
            {
                key: 'spendingLevel',
                gridColumn: 12,
                lines: 1
            },
            {
                key: 'cash',
                gridColumn: 12,
                lines: 1
            },
            {
                key: 'assets',
                gridColumn: 12,
                lines: 3
            }
        ]
    },
    {
        key: 'fellowInvestigators',
        gridColumn: 12,
        lines: 5
    }
];
