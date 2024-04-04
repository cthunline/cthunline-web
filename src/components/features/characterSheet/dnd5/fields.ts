import {
    type DnD5Biography,
    type DnD5Features,
    type DnD5Story
} from '@cthunline/games';
import { type Field } from '../generic/fieldLayout/FieldLayout';

export const biographyFields: Field<DnD5Biography>[] = [
    {
        key: 'name',
        gridColumn: 5
    },
    {
        key: 'class',
        gridColumn: 5
    },
    {
        key: 'level',
        type: 'number',
        gridColumn: 2
    },
    {
        key: 'background',
        gridColumn: 4
    },
    {
        key: 'race',
        gridColumn: 4
    },
    {
        key: 'alignment',
        gridColumn: 4
    },
    {
        key: 'description',
        gridColumn: 12,
        lines: 2
    }
];

export const featuresFields: Field<DnD5Features>[] = [
    {
        key: 'featuresAndTraits',
        gridColumn: 6,
        lines: 8
    },
    {
        key: 'proficienciesAndLanguages',
        gridColumn: 6,
        lines: 8
    }
];

export const storyFields: Field<DnD5Story>[] = [
    {
        key: 'backstory',
        gridColumn: 12,
        lines: 4
    },
    {
        key: 'personalityTraits',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'ideals',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'bonds',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'flaws',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'alliesAndOrganizations',
        gridColumn: 12,
        lines: 4
    }
];
