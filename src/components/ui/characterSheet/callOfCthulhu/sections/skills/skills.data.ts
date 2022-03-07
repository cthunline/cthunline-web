import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key: keyof CoCSkill;
    label: string;
    editable?: boolean;
}

export const skillKeys: KeyData[] = [{
    key: 'regular',
    label: 'Reg',
    editable: true
}, {
    key: 'half',
    label: 'Half'
}, {
    key: 'fifth',
    label: 'Fifth'
}];

export interface SkillData {
    name: string;
    base: string;
    development?: boolean;
}

export const skillList: SkillData[] = [
    { name: 'Accounting', base: '5%', development: true },
    { name: 'Anthropology', base: '1%', development: true },
    { name: 'Appraise', base: '5%', development: true },
    { name: 'Archaeology', base: '1%', development: true },
    { name: 'Charm', base: '15%', development: true },
    { name: 'Climb', base: '20%', development: true },
    { name: 'Credit Rating', base: '0%', development: false },
    { name: 'Cthulhu Mythos', base: '0%', development: false },
    { name: 'Disguise', base: '5%', development: true },
    { name: 'Dodge', base: 'DEX/2', development: true },
    { name: 'Drive Auto', base: '20%', development: true },
    { name: 'Elec. Repair', base: '10%', development: true },
    { name: 'Fast Talk', base: '5%', development: true },
    { name: 'Fighting (Brawl)', base: '25%', development: true },
    { name: 'Firearms (Handgun)', base: '20%', development: true },
    { name: 'Firearms (Rifle/Shotgun)', base: '25%', development: true },
    { name: 'First Aid', base: '30%', development: true },
    { name: 'History', base: '5%', development: true },
    { name: 'Intimidate', base: '15%', development: true },
    { name: 'Jump', base: '20%', development: true },
    { name: 'Language (Own)', base: 'EDU', development: true },
    { name: 'Law', base: '5%', development: true },
    { name: 'Library Use', base: '20%', development: true },
    { name: 'Listen', base: '20%', development: true },
    { name: 'Locksmith', base: '1%', development: true },
    { name: 'Mech. Repair', base: '10%', development: true },
    { name: 'Medicine', base: '1%', development: true },
    { name: 'Natural World', base: '10%', development: true },
    { name: 'Navigate', base: '10%', development: true },
    { name: 'Occult', base: '5%', development: true },
    { name: 'Persuade', base: '10%', development: true },
    { name: 'Psychoanalysis', base: '1%', development: true },
    { name: 'Psychology', base: '10%', development: true },
    { name: 'Ride', base: '5%', development: true },
    { name: 'Sleight of Hand', base: '10%', development: true },
    { name: 'Spot Hidden', base: '25%', development: true },
    { name: 'Stealth', base: '20%', development: true },
    { name: 'Swim', base: '20%', development: true },
    { name: 'Throw', base: '20%', development: true },
    { name: 'Track', base: '10%', development: true }
];
