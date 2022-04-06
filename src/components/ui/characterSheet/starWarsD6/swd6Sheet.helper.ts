import {
    SWD6CharacterData,
    SWD6WoundStatus,
    SWD6WoundStatusKey
} from '../../../../types/games/starWarsD6';

const orderedWoundStatus: SWD6WoundStatusKey[] = [
    'stunned',
    'wounded',
    'doublyWounded',
    'incapacitated',
    'mortallyWounded'
];

export const controlWoundStatus = (woundStatusData: SWD6WoundStatus) => {
    const woundStatus = woundStatusData;
    let highestWoundStatus: SWD6WoundStatusKey | null = null;
    orderedWoundStatus.forEach((status) => {
        if (woundStatus[status]) {
            highestWoundStatus = status;
        }
        woundStatus[status] = false;
    });
    if (highestWoundStatus) {
        woundStatus[highestWoundStatus as SWD6WoundStatusKey] = true;
        if (highestWoundStatus === 'doublyWounded') {
            woundStatus.wounded = true;
        }
    }
    return woundStatus;
};

export const controlCharacterData = (characterData: SWD6CharacterData): SWD6CharacterData => {
    const charData = characterData;
    charData.woundStatus = controlWoundStatus(charData.woundStatus);
    return charData;
};

const defaultAttribute = {
    value: '',
    skills: []
};

export const defaultData: SWD6CharacterData = {
    portrait: '',
    biography: {
        name: '',
        occupation: '',
        species: '',
        age: 0,
        height: '',
        weight: '',
        description: ''
    },
    attributes: {
        dexterity: { ...defaultAttribute },
        knowledge: { ...defaultAttribute },
        mechanical: { ...defaultAttribute },
        perception: { ...defaultAttribute },
        strength: { ...defaultAttribute },
        technical: { ...defaultAttribute }
    },
    abilities: [],
    statistics: {
        move: 0,
        forceSensitive: false,
        forcePoints: 0,
        darkSidePoints: 0,
        characterPoints: 0
    },
    woundStatus: {
        stunned: false,
        wounded: false,
        doublyWounded: false,
        incapacitated: false,
        mortallyWounded: false
    },
    weapons: [],
    story: {
        equipment: '',
        background: '',
        personality: '',
        objectives: '',
        quote: '',
        connections: ''
    }
};
