import {
    SWD6Character,
    SWD6WoundStatus,
    SWD6WoundStatusKey
} from '@cthunline/games';

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

export const controlCharacterData = (characterData: SWD6Character): SWD6Character => {
    const charData = characterData;
    charData.woundStatus = controlWoundStatus(charData.woundStatus);
    return charData;
};
