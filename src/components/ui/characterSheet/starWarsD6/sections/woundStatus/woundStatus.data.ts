import { SWD6WoundStatus } from '../../../../../../types/games/starWarsD6';

export interface WoundStatusField {
    keys: (keyof SWD6WoundStatus)[];
    label: string;
}

export const woundStatusFields: WoundStatusField[] = [{
    keys: ['stunned'],
    label: 'Stunned'
}, {
    keys: ['wounded', 'doublyWounded'],
    label: 'Wounded'
}, {
    keys: ['incapacitated'],
    label: 'Incapacitated'
}, {
    keys: ['mortallyWounded'],
    label: 'Mortally wounded'
}];
