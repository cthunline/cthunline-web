import { type CoCSkill } from '@cthunline/games';

export interface KeyData {
    key: keyof CoCSkill;
    textKey: string;
    editable?: boolean;
}

export const skillKeys: KeyData[] = [
    {
        key: 'regular',
        textKey: 'reg',
        editable: true
    },
    {
        key: 'half',
        textKey: 'half'
    },
    {
        key: 'fifth',
        textKey: 'fifth'
    }
];

export interface SkillData {
    name: string;
    base: string;
    development: boolean;
}

export const defaultSkillValue: SkillData = {
    name: '',
    base: '',
    development: true
};

export interface SkillListItem extends Omit<SkillData, 'name'> {
    key: string;
}

export const skillList: SkillListItem[] = [
    { key: 'accounting', base: '5%', development: true },
    { key: 'anthropology', base: '1%', development: true },
    { key: 'appraise', base: '5%', development: true },
    { key: 'archaeology', base: '1%', development: true },
    { key: 'charm', base: '15%', development: true },
    { key: 'climb', base: '20%', development: true },
    { key: 'creditRating', base: '0%', development: false },
    { key: 'cthulhuMythos', base: '0%', development: false },
    { key: 'disguise', base: '5%', development: true },
    { key: 'dodge', base: 'DEX/2', development: true },
    { key: 'driveAuto', base: '20%', development: true },
    { key: 'electricalRepair', base: '10%', development: true },
    { key: 'fastTalk', base: '5%', development: true },
    { key: 'fightingBrawl', base: '25%', development: true },
    { key: 'firearmsHandgun', base: '20%', development: true },
    { key: 'firearmsRifleShotgun', base: '25%', development: true },
    { key: 'firstAid', base: '30%', development: true },
    { key: 'history', base: '5%', development: true },
    { key: 'intimidate', base: '15%', development: true },
    { key: 'jump', base: '20%', development: true },
    { key: 'languageOwn', base: 'EDU', development: true },
    { key: 'law', base: '5%', development: true },
    { key: 'libraryUse', base: '20%', development: true },
    { key: 'listen', base: '20%', development: true },
    { key: 'locksmith', base: '1%', development: true },
    { key: 'mechanicalRepair', base: '10%', development: true },
    { key: 'medicine', base: '1%', development: true },
    { key: 'naturalWorld', base: '10%', development: true },
    { key: 'navigate', base: '10%', development: true },
    { key: 'occult', base: '5%', development: true },
    { key: 'persuade', base: '10%', development: true },
    { key: 'psychoanalysis', base: '1%', development: true },
    { key: 'psychology', base: '10%', development: true },
    { key: 'ride', base: '5%', development: true },
    { key: 'sleightOfHand', base: '10%', development: true },
    { key: 'spotHidden', base: '25%', development: true },
    { key: 'stealth', base: '20%', development: true },
    { key: 'survival', base: '10%', development: true },
    { key: 'swim', base: '20%', development: true },
    { key: 'throw', base: '20%', development: true },
    { key: 'track', base: '10%', development: true }
];
