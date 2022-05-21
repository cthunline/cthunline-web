import { SWD6WoundStatus } from '@cthunline/games';

export interface WoundStatusField {
    keys: (keyof SWD6WoundStatus)[];
    textKey: string;
}

export const woundStatusFields: WoundStatusField[] = [{
    keys: ['stunned'],
    textKey: 'stunned'
}, {
    keys: ['wounded', 'doublyWounded'],
    textKey: 'wounded'
}, {
    keys: ['incapacitated'],
    textKey: 'incapacitated'
}, {
    keys: ['mortallyWounded'],
    textKey: 'mortallyWounded'
}];
