import { SWD6Statistics } from '../../../../../../types/games/starWarsD6';

export interface StatisticsField {
    key: keyof SWD6Statistics;
    label: string;
    type: 'number' | 'boolean';
}

export const statisticsFields: StatisticsField[] = [{
    key: 'move',
    label: 'Move',
    type: 'number'
}, {
    key: 'forceSensitive',
    label: 'Force sensitive',
    type: 'boolean'
}, {
    key: 'forcePoints',
    label: 'Force points',
    type: 'number'
}, {
    key: 'darkSidePoints',
    label: 'Dark side points',
    type: 'number'
}, {
    key: 'characterPoints',
    label: 'Character points',
    type: 'number'
}];
