import { CoCBiography } from '../../../../types/games/callOfCthulhu';
import { Field } from '../generic/fieldLayout/FieldLayout';

// eslint-disable-next-line import/prefer-default-export
export const biographyFields: Field<CoCBiography>[] = [{
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
