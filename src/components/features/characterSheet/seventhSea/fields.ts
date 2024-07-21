import type {
    SeventhSeaAdvantage,
    SeventhSeaArcana,
    SeventhSeaBackground,
    SeventhSeaBiography,
    SeventhSeaStory
} from '@cthunline/games';

import type { Field } from '../generic/fieldLayout/FieldLayout.js';

export const biographyFields: Field<SeventhSeaBiography>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        key: 'concept',
        gridColumn: 6
    },
    {
        key: 'nation',
        gridColumn: 6
    },
    {
        key: 'religion',
        gridColumn: 6
    },
    {
        key: 'reputations',
        gridColumn: 9
    },
    {
        key: 'wealth',
        type: 'number',
        gridColumn: 3
    }
];

export const arcanaFields: Field<SeventhSeaArcana>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        gridColumn: 6
    },
    {
        key: 'virtue',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'hubris',
        gridColumn: 6,
        lines: 4
    }
];

export const backgroundFields: Field<SeventhSeaBackground>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        gridColumn: 6
    },
    {
        key: 'description',
        gridColumn: 6,
        lines: 4
    },
    {
        key: 'quirk',
        gridColumn: 6,
        lines: 4
    }
];

export const storyFields: Field<SeventhSeaStory>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        gridColumn: 6
    },
    {
        key: 'goal',
        gridColumn: 6,
        lines: 3
    },
    {
        key: 'reward',
        gridColumn: 6,
        lines: 3
    }
];

export const advantageFields: Field<SeventhSeaAdvantage>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        gridColumn: 6
    },
    {
        key: 'description',
        gridColumn: 12,
        lines: 3
    }
];
