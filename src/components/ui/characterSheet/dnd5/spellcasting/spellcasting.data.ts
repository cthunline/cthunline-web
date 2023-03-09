import { DnD5Spellcasting, DnD5SpellLevel } from '@cthunline/games';

export interface SpellcastingField {
    key: keyof DnD5Spellcasting;
    type: 'string' | 'number';
    gridColumn: number;
}

export const spellcastingFields: SpellcastingField[] = [
    {
        key: 'class',
        type: 'string',
        gridColumn: 6
    },
    {
        key: 'spellAbility',
        type: 'number',
        gridColumn: 2
    },
    {
        key: 'spellSaveDC',
        type: 'number',
        gridColumn: 2
    },
    {
        key: 'spellAttackBonus',
        type: 'number',
        gridColumn: 2
    }
];

export const spellLevelFields: (keyof DnD5SpellLevel)[] = [
    'slotsTotal',
    'slotsExpended'
];

export const getDefaulSpellLevel = (level: number) => ({
    level,
    slotsTotal: 0,
    slotsExpended: 0,
    spells: []
});

export const defaultSpell = {
    prepared: false,
    name: ''
};
