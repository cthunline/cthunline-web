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
    { name: 'Accounting', base: '5%' },
    { name: 'Anthropology', base: '1%' },
    { name: 'Appraise', base: '5%' },
    { name: 'Archaeology', base: '1%' },
    { name: 'Charm', base: '15%' },
    { name: 'Climb', base: '20%' },
    { name: 'Credit Rating', base: '0%' },
    { name: 'Cthulhu Mythos', base: '0%' },
    { name: 'Disguise', base: '5%' },
    { name: 'Dodge', base: 'DEX/2' },
    { name: 'Drive Auto', base: '20%' },
    { name: 'Elec. Repair', base: '10%' },
    { name: 'Fast Talk', base: '5%' },
    { name: 'Fighting (Brawl)', base: '25%' },
    { name: 'Firearms (Handgun)', base: '20%' },
    { name: 'Firearms (Rifle/Shotgun)', base: '25%' },
    { name: 'First Aid', base: '30%' },
    { name: 'History', base: '5%' },
    { name: 'Intimidate', base: '15%' },
    { name: 'Jump', base: '20%' },
    { name: 'Language (Own)', base: 'EDU' },
    { name: 'Law', base: '5%' },
    { name: 'Library Use', base: '20%' },
    { name: 'Listen', base: '20%' },
    { name: 'Locksmith', base: '1%' },
    { name: 'Mech. Repair', base: '10%' },
    { name: 'Medicine', base: '1%' },
    { name: 'Natural World', base: '10%' },
    { name: 'Navigate', base: '10%' },
    { name: 'Occult', base: '5%' },
    { name: 'Persuade', base: '10%' },
    { name: 'Psychoanalysis', base: '1%' },
    { name: 'Psychology', base: '10%' },
    { name: 'Ride', base: '5%' },
    { name: 'Sleight of Hand', base: '10%' },
    { name: 'Spot Hidden', base: '25%' },
    { name: 'Stealth', base: '20%' },
    { name: 'Swim', base: '20%' },
    { name: 'Throw', base: '20%' },
    { name: 'Track', base: '10%' }
];
