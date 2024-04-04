import { type SWD6Biography, type SWD6Story } from '@cthunline/games';

import { type Field } from '../generic/fieldLayout/FieldLayout';

export const biographyFields: Field<SWD6Biography>[] = [
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
        key: 'species',
        gridColumn: 6
    },
    {
        key: 'height',
        gridColumn: 3
    },
    {
        key: 'weight',
        gridColumn: 3
    },
    {
        key: 'description',
        gridColumn: 12
    }
];

export const storyFields: Field<SWD6Story>[] = [
    {
        key: 'equipment',
        title: true,
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'background',
        title: true,
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'personality',
        title: true,
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'objectives',
        title: true,
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'quote',
        title: true,
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'connections',
        title: true,
        gridColumn: 6,
        lines: 3
    }
];
