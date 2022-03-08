import { CoCCombat } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key: keyof CoCCombat;
    label: string;
}

export const combatKeys: KeyData[] = [{
    key: 'move',
    label: 'Move'
}, {
    key: 'damageBonus',
    label: 'Damage Bonus'
}, {
    key: 'build',
    label: 'Build'
}];
