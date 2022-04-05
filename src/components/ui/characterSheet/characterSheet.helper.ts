import { defaultData as cocDefaultData } from './callOfCthulhu/cocSheet.helper';
import { defaultData as swd6DefaultData } from './starWarsD6/swd6Sheet.helper';

// eslint-disable-next-line import/prefer-default-export
export const getDefaultData = (gameId: string) => {
    if (gameId === 'callOfCthulhu') {
        return cocDefaultData;
    }
    if (gameId === 'starWarsD6') {
        return swd6DefaultData;
    }
    throw new Error('Could not get default character data');
};
