import { DnD5Attack } from '@cthunline/games';

export const defaultAttack: DnD5Attack = {
    name: '',
    attackBonus: 0,
    damage: '',
    type: ''
};

export interface AttackField {
    key: keyof DnD5Attack;
    type: 'string' | 'number';
    gridColumn: number;
}

export const attackFields: AttackField[] = [
    {
        key: 'name',
        type: 'string',
        gridColumn: 4
    },
    {
        key: 'attackBonus',
        type: 'number',
        gridColumn: 2
    },
    {
        key: 'damage',
        type: 'string',
        gridColumn: 3
    },
    {
        key: 'type',
        type: 'string',
        gridColumn: 3
    }
];
