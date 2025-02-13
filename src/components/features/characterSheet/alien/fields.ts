import type {
    AlienArmor,
    AlienBiography,
    AlienConditions,
    AlienConsumables,
    AlienEquipment,
    AlienExperience,
    AlienRelationships,
    AlienStatus
} from '@cthunline/games';

import {
    GiCloudRing,
    GiMarbles,
    GiSwissArmyKnife,
    GiWeight
} from 'react-icons/gi';
import type { Field } from '../generic/fieldLayout/FieldLayout.js';

export const biographyIdentityFields: Field<AlienBiography>[] = [
    {
        key: 'name',
        gridColumn: 6
    },
    {
        key: 'career',
        gridColumn: 6
    },
    {
        key: 'appearance',
        gridColumn: 12,
        lines: 3
    }
];

export const relationshipsFields: Field<AlienRelationships>[] = [
    {
        key: 'buddy',
        gridColumn: 6
    },
    {
        key: 'rival',
        gridColumn: 6
    }
];

export const statusFields: Field<AlienStatus>[] = [
    {
        key: 'stressLevel',
        gridColumn: 12,
        type: 'number'
    },
    {
        key: 'health',
        gridColumn: 12,
        type: 'number'
    },
    {
        key: 'radiation',
        gridColumn: 12,
        type: 'number'
    }
];

export const criticalInjuriesFields: Field<AlienStatus>[] = [
    {
        key: 'criticalInjuries',
        gridColumn: 12,
        lines: 4
    }
];

export const conditionsFields: Field<AlienConditions>[] = [
    {
        key: 'starving',
        gridColumn: 12,
        type: 'boolean'
    },
    {
        key: 'dehydrated',
        gridColumn: 12,
        type: 'boolean'
    },
    {
        key: 'exhausted',
        gridColumn: 12,
        type: 'boolean'
    },
    {
        key: 'freezing',
        gridColumn: 12,
        type: 'boolean'
    }
];

export const experienceFields: Field<AlienExperience>[] = [
    {
        key: 'experiencePoints',
        gridColumn: 6,
        type: 'number'
    },
    {
        key: 'storyPoints',
        gridColumn: 6,
        type: 'number'
    }
];

export const equipmentFields: Field<AlienEquipment>[] = [
    {
        key: 'signatureItem',
        gridColumn: 12,
        title: true,
        TitleIcon: GiCloudRing
    },
    {
        key: 'gear',
        gridColumn: 6,
        lines: 6,
        title: true,
        TitleIcon: GiSwissArmyKnife
    },
    {
        key: 'tinyItems',
        gridColumn: 6,
        lines: 6,
        title: true,
        TitleIcon: GiMarbles
    }
];

export const armorFields: Field<AlienArmor>[] = [
    {
        key: 'name',
        gridColumn: 9
    },
    {
        key: 'rating',
        gridColumn: 3,
        type: 'number'
    }
];

export const encumbranceFields: Field<AlienEquipment>[] = [
    {
        key: 'encumbrance',
        gridColumn: 12,
        type: 'number',
        title: true,
        TitleIcon: GiWeight
    }
];

export const consumablesFields: Field<AlienConsumables>[] = [
    {
        key: 'air',
        gridColumn: 3,
        type: 'number'
    },
    {
        key: 'power',
        gridColumn: 3,
        type: 'number'
    },
    {
        key: 'food',
        gridColumn: 3,
        type: 'number'
    },
    {
        key: 'water',
        gridColumn: 3,
        type: 'number'
    }
];
