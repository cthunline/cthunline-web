import { CoCStatus } from '../../../../../../types/games/callOfCthulhu';

export interface FieldData {
    field: keyof CoCStatus;
    label: string;
}

export const fields: FieldData[] = [{
    field: 'temporaryInsanity',
    label: 'Temporary Insanity'
}, {
    field: 'indefiniteInsanity',
    label: 'Indefinite Insanity'
}, {
    field: 'majorWound',
    label: 'Major Wound'
}, {
    field: 'unconscious',
    label: 'Unconscious'
}, {
    field: 'dying',
    label: 'Dying'
}];
