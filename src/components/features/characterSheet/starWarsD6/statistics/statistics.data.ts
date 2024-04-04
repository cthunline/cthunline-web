import { type SWD6Statistics } from '@cthunline/games';

export interface StatisticsField {
    key: keyof SWD6Statistics;
    type: 'number' | 'boolean';
}

export const statisticsFields: StatisticsField[] = [
    {
        key: 'move',
        type: 'number'
    },
    {
        key: 'forceSensitive',
        type: 'boolean'
    },
    {
        key: 'forcePoints',
        type: 'number'
    },
    {
        key: 'darkSidePoints',
        type: 'number'
    },
    {
        key: 'characterPoints',
        type: 'number'
    }
];
