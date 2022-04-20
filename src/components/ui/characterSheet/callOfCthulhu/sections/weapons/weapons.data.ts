import { CoCWeapon } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key: keyof CoCWeapon;
    gridColumn: number;
}

export const weaponKeys: KeyData[] = [{
    key: 'damage',
    gridColumn: 4
}, {
    key: 'attacks',
    gridColumn: 2
}, {
    key: 'range',
    gridColumn: 3
}, {
    key: 'ammo',
    gridColumn: 2
}, {
    key: 'malfunction',
    gridColumn: 3
}];

export const weaponAddKeys: KeyData[] = [{
    key: 'name',
    gridColumn: 8
}, {
    key: 'damage',
    gridColumn: 4
}, {
    key: 'attacks',
    gridColumn: 2
}, {
    key: 'range',
    gridColumn: 3
}, {
    key: 'ammo',
    gridColumn: 2
}, {
    key: 'malfunction',
    gridColumn: 3
}];
