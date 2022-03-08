import { CoCWeapon } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key: keyof CoCWeapon;
    label: string;
    gridColumn: number;
}

export const weaponKeys: KeyData[] = [{
    key: 'damage',
    label: 'Damage',
    gridColumn: 4
}, {
    key: 'attacks',
    label: 'Attacks',
    gridColumn: 2
}, {
    key: 'range',
    label: 'Range',
    gridColumn: 3
}, {
    key: 'ammo',
    label: 'Ammo',
    gridColumn: 2
}, {
    key: 'malfunction',
    label: 'Malfunction',
    gridColumn: 3
}];

export const weaponAddKeys: KeyData[] = [{
    key: 'name',
    label: 'Weapon Name',
    gridColumn: 8
}, {
    key: 'damage',
    label: 'Damage',
    gridColumn: 4
}, {
    key: 'attacks',
    label: 'Attacks',
    gridColumn: 2
}, {
    key: 'range',
    label: 'Range',
    gridColumn: 3
}, {
    key: 'ammo',
    label: 'Ammo',
    gridColumn: 2
}, {
    key: 'malfunction',
    label: 'Malfunction',
    gridColumn: 3
}];
