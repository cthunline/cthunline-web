import { CoCStory } from '../../../../../../types/games/callOfCthulhu';

export interface KeyData {
    key?: keyof CoCStory;
    label?: string;
    gridColumn: number;
    lines?: number;
    children?: KeyData[];
}

export const storyKeys: KeyData[] = [{
    key: 'story',
    label: 'My Story',
    gridColumn: 12,
    lines: 5
}, {
    key: 'personalDescription',
    label: 'Personal Description',
    gridColumn: 6,
    lines: 3
}, {
    key: 'traits',
    label: 'Traits',
    gridColumn: 6,
    lines: 3
}, {
    key: 'ideologyAndBeliefs',
    label: 'Ideology & Beliefs',
    gridColumn: 6,
    lines: 3
}, {
    key: 'injuriesAndScars',
    label: 'Injuries & Scars',
    gridColumn: 6,
    lines: 3
}, {
    key: 'significantPeople',
    label: 'Significant People',
    gridColumn: 6,
    lines: 3
}, {
    key: 'phobiasAndManias',
    label: 'Phobias & Manias',
    gridColumn: 6,
    lines: 3
}, {
    key: 'meaningfulLocations',
    label: 'Meaningful Locations',
    gridColumn: 6,
    lines: 3
}, {
    key: 'arcaneTomesAndSpells',
    label: 'Arcane Tomes & Spells',
    gridColumn: 6,
    lines: 3
}, {
    key: 'treasuredPossessions',
    label: 'Treasured Possessions',
    gridColumn: 6,
    lines: 3
}, {
    key: 'encountersWithStrangeEntities',
    label: 'Encounters with Strange Entities',
    gridColumn: 6,
    lines: 3
}, {
    key: 'gearAndPossessions',
    label: 'Gear & Possessions',
    gridColumn: 6,
    lines: 9
}, {
    gridColumn: 6,
    children: [{
        key: 'spendingLevel',
        label: 'Spending Level',
        gridColumn: 12,
        lines: 1
    }, {
        key: 'cash',
        label: 'Cash',
        gridColumn: 12,
        lines: 1
    }, {
        key: 'assets',
        label: 'Assets',
        gridColumn: 12,
        lines: 3
    }]
}, {
    key: 'fellowInvestigators',
    label: 'Fellow Investigators',
    gridColumn: 12,
    lines: 5
}];
