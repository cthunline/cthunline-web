import { CoCStatus } from '../../../../../../types/games/callOfCthulhu';

export interface FieldData {
    field: keyof CoCStatus;
    label: string;
}

export const fields: (keyof CoCStatus)[] = [
    'temporaryInsanity',
    'indefiniteInsanity',
    'majorWound',
    'unconscious',
    'dying'
];
