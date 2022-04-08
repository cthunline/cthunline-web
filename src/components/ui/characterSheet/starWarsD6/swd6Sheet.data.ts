import { SWD6Biography } from '../../../../types/games/starWarsD6';
import { Field } from '../generic/fieldLayout/FieldLayout';

// eslint-disable-next-line import/prefer-default-export
export const biographyFields: Field<SWD6Biography>[] = [{
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
