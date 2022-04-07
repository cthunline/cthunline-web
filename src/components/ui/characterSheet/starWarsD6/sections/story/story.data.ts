import { SWD6Story } from '../../../../../../types/games/starWarsD6';

export interface FieldData {
    key?: keyof SWD6Story;
    label?: string;
    gridColumn: number;
    lines?: number;
}

export const storyFields: FieldData[] = [{
    key: 'equipment',
    label: 'Equipment',
    gridColumn: 6,
    lines: 3
}, {
    key: 'background',
    label: 'Background',
    gridColumn: 6,
    lines: 3
}, {
    key: 'personality',
    label: 'Personality',
    gridColumn: 6,
    lines: 3
}, {
    key: 'objectives',
    label: 'Objectives',
    gridColumn: 6,
    lines: 3
}, {
    key: 'quote',
    label: 'A quote',
    gridColumn: 6,
    lines: 3
}, {
    key: 'connections',
    label: 'Connection with other characters',
    gridColumn: 6,
    lines: 3
}];
