import { SWD6Weapon } from '../../../../../../types/games/starWarsD6';

export interface FieldData {
    key: keyof SWD6Weapon;
    label: string;
    gridColumn: number;
}

export const weaponFields: FieldData[] = [{
    key: 'name',
    label: 'Name',
    gridColumn: 4
}, {
    key: 'damage',
    label: 'Damage',
    gridColumn: 2
}, {
    key: 'shortRange',
    label: 'Short',
    gridColumn: 2
}, {
    key: 'mediumRange',
    label: 'Medium',
    gridColumn: 2
}, {
    key: 'longRange',
    label: 'Long',
    gridColumn: 2
}, {
    key: 'ammo',
    label: 'Ammo',
    gridColumn: 2
}];
