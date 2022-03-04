import {
    CoCCharacteristic,
    CoCCharacteristics,
    CoCLuck,
    CoCPoints,
    CoCPoint,
    CoCSanity
} from '../../../../../../types/games/callOfCthulhu';

export interface FieldData<DataType> {
    field: keyof DataType;
    label: string;
    shortLabel: string;
}

export interface KeyData<DataType> {
    key: keyof DataType;
    label: string;
    editable?: boolean;
}

export const charFields: FieldData<CoCCharacteristics>[] = [{
    field: 'strength',
    shortLabel: 'STR',
    label: 'Strength'
}, {
    field: 'size',
    shortLabel: 'SIZ',
    label: 'Size'
}, {
    field: 'constitution',
    shortLabel: 'CON',
    label: 'Constitution'
}, {
    field: 'power',
    shortLabel: 'POW',
    label: 'Power'
}, {
    field: 'dexterity',
    shortLabel: 'DEX',
    label: 'Dexterity'
}, {
    field: 'appearance',
    shortLabel: 'APP',
    label: 'Appearance'
}, {
    field: 'intelligence',
    shortLabel: 'INT',
    label: 'Intelligence'
}, {
    field: 'education',
    shortLabel: 'EDU',
    label: 'Education'
}];

export const charKeys: KeyData<CoCCharacteristic>[] = [{
    key: 'regular',
    label: 'Reg',
    editable: true
}, {
    key: 'half',
    label: 'Half'
}, {
    key: 'fifth',
    label: 'Fifth'
}];

export const pointsFields: FieldData<CoCPoints>[] = [{
    field: 'hitPoints',
    shortLabel: 'HP',
    label: 'Hit Points'
}, {
    field: 'magicPoints',
    shortLabel: 'MP',
    label: 'Magic Points'
}];

export const pointsKeys: KeyData<CoCPoint>[] = [{
    key: 'current',
    label: 'Current',
    editable: true
}, {
    key: 'maximum',
    label: 'Max'
}];

export const luckKeys: KeyData<CoCLuck>[] = [{
    key: 'current',
    label: 'Current',
    editable: true
}, {
    key: 'starting',
    label: 'Start',
    editable: true
}];

export const sanityKeys: KeyData<CoCSanity>[] = [{
    key: 'current',
    label: 'Current',
    editable: true
}, {
    key: 'starting',
    label: 'Start',
    editable: true
}, {
    key: 'maximum',
    label: 'Max'
}];
