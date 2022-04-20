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
    textKey: string;
}

export interface KeyData<DataType> {
    key: keyof DataType;
    textKey: string;
    editable?: boolean;
}

export const charFields: FieldData<CoCCharacteristics>[] = [{
    field: 'strength',
    textKey: 'str'
}, {
    field: 'size',
    textKey: 'siz'
}, {
    field: 'constitution',
    textKey: 'con'
}, {
    field: 'power',
    textKey: 'pow'
}, {
    field: 'dexterity',
    textKey: 'dex'
}, {
    field: 'appearance',
    textKey: 'app'
}, {
    field: 'intelligence',
    textKey: 'int'
}, {
    field: 'education',
    textKey: 'edu'
}];

export const charKeys: KeyData<CoCCharacteristic>[] = [{
    key: 'regular',
    textKey: 'reg',
    editable: true
}, {
    key: 'half',
    textKey: 'half'
}, {
    key: 'fifth',
    textKey: 'fifth'
}];

export const pointsFields: FieldData<CoCPoints>[] = [{
    field: 'hitPoints',
    textKey: 'hp'
}, {
    field: 'magicPoints',
    textKey: 'mp'
}];

export const pointsKeys: KeyData<CoCPoint>[] = [{
    key: 'current',
    textKey: 'current',
    editable: true
}, {
    key: 'maximum',
    textKey: 'max'
}];

export const luckKeys: KeyData<CoCLuck>[] = [{
    key: 'current',
    textKey: 'current',
    editable: true
}, {
    key: 'starting',
    textKey: 'starting',
    editable: true
}];

export const sanityKeys: KeyData<CoCSanity>[] = [{
    key: 'current',
    textKey: 'current',
    editable: true
}, {
    key: 'starting',
    textKey: 'starting'
}, {
    key: 'maximum',
    textKey: 'max'
}];
