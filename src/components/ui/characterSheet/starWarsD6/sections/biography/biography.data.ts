import { SWD6Biography } from '../../../../../../types/games/starWarsD6';

export interface BioFieldData {
    field: keyof SWD6Biography;
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
    field: 'species',
    label: 'Species',
    grid: 6
}, {
    field: 'height',
    label: 'Height',
    grid: 3
}, {
    field: 'weight',
    label: 'Weight',
    grid: 3
}, {
    field: 'description',
    label: 'Description',
    grid: 12
}];
