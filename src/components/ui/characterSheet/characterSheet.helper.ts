import { defaultData as cocDefaultData } from './callOfCthulhu/cocSheet.helper';

// eslint-disable-next-line import/prefer-default-export
export const getDefaultData = (gameId: string) => {
    switch (gameId) {
        case 'callOfCthulhu':
            return cocDefaultData;
        default:
            return null;
    }
};
