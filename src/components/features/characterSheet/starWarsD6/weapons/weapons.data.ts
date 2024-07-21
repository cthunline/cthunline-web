import type { SWD6Weapon } from '@cthunline/games';

export interface FieldData {
    key: keyof SWD6Weapon;
    gridColumn: number;
}

export const weaponFields: FieldData[] = [
    {
        key: 'name',
        gridColumn: 4
    },
    {
        key: 'damage',
        gridColumn: 2
    },
    {
        key: 'shortRange',
        gridColumn: 2
    },
    {
        key: 'mediumRange',
        gridColumn: 2
    },
    {
        key: 'longRange',
        gridColumn: 2
    },
    {
        key: 'ammo',
        gridColumn: 2
    }
];
