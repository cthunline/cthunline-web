import { CoCBiography } from '../../../../../../types/games/callOfCthulhu';

export type BioField = keyof CoCBiography;

export interface BioFieldData {
    field: BioField;
    label: string;
    type?: string;
    grid: number;
}

export const fields: BioFieldData[] = [{
    field: 'name',
    label: 'Name',
    grid: 5
}, {
    field: 'occupation',
    label: 'Occupation',
    grid: 5
}, {
    field: 'age',
    label: 'Age',
    type: 'number',
    grid: 2
}, {
    field: 'birthPlace',
    label: 'Birth Place',
    grid: 6
},
{
    field: 'residence',
    label: 'Residence',
    grid: 6
}];
