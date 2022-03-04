import {
    CoCCharacteristic,
    CoCPoint,
    CoCSanity
} from '../../../../../../types/games/callOfCthulhu';

export const controlCharacteristic = (charData: CoCCharacteristic): CoCCharacteristic => {
    const char = charData;
    char.half = Math.floor(char.regular / 2);
    char.fifth = Math.floor(char.regular / 5);
    return char;
};

export const controlPoint = (pointData: CoCPoint): CoCPoint => {
    const point = pointData;
    if (point.current > point.maximum) {
        point.current = point.maximum;
    }
    return point;
};

export const controlSanity = (sanityData: CoCSanity): CoCSanity => {
    const sanity = sanityData;
    if (sanity.starting > sanity.maximum) {
        sanity.starting = sanity.maximum;
    }
    if (sanity.current > sanity.maximum) {
        sanity.current = sanity.maximum;
    }
    return sanity;
};
