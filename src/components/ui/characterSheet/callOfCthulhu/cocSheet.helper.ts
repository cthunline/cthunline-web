import {
    CoCCharacter,
    CoCCharacteristic,
    CoCPoint,
    CoCSanity,
    CoCSkill,
    CoCCombat
} from '@cthunline/games';

export const controlCharacteristic = (
    characteristic: CoCCharacteristic
): CoCCharacteristic => {
    const char = characteristic;
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

export const controlSkill = (skillData: CoCSkill): CoCSkill => {
    const skill = skillData;
    skill.half = Math.floor(skill.regular / 2);
    skill.fifth = Math.floor(skill.regular / 5);
    return skill;
};

const calculateMove = (characterData: CoCCharacter): number => {
    let move = 8;
    const { age } = characterData.biography;
    const { strength, dexterity, size } = characterData.characteristics;
    if (strength.regular < size.regular && dexterity.regular < size.regular) {
        move = 7;
    } else if (
        strength.regular > size.regular &&
        dexterity.regular > size.regular
    ) {
        move = 9;
    }
    if (age >= 80) {
        move -= 5;
    } else if (age >= 70) {
        move -= 4;
    } else if (age >= 60) {
        move -= 3;
    } else if (age >= 50) {
        move -= 2;
    } else if (age >= 40) {
        move -= 1;
    }
    return move;
};

const calculateDamageBonusAndBuild = (
    characterData: CoCCharacter
): Omit<CoCCombat, 'move'> => {
    const { strength, size } = characterData.characteristics;
    const sum = strength.regular + size.regular;
    if (sum >= 205) {
        const higherRange = sum - 204;
        const rangeResult = Math.ceil(higherRange / 80);
        const numberOfD6 = rangeResult + 1;
        const damageBonusNumber = rangeResult + 2;
        return {
            damageBonus: `+${numberOfD6}D6`,
            build: `+${damageBonusNumber}`
        };
    }
    if (sum >= 165) {
        return { damageBonus: '+1D6', build: '+2' };
    }
    if (sum >= 125) {
        return { damageBonus: '+1D4', build: '+1' };
    }
    if (sum >= 85) {
        return { damageBonus: 'None', build: 'O' };
    }
    if (sum >= 65) {
        return { damageBonus: '-1', build: '-1' };
    }
    return { damageBonus: '-2', build: '-2' };
};

const calculateCombat = (characterData: CoCCharacter): CoCCombat => {
    const move = calculateMove(characterData);
    const rest = calculateDamageBonusAndBuild(characterData);
    return {
        move,
        ...rest
    };
};

export const controlCharacterData = (
    characterData: CoCCharacter
): CoCCharacter => {
    const charData = characterData;
    charData.points.magicPoints.maximum = Math.floor(
        charData.characteristics.power.regular / 5
    );
    charData.points.magicPoints = controlPoint(charData.points.magicPoints);
    charData.points.hitPoints.maximum = Math.floor(
        (charData.characteristics.size.regular +
            charData.characteristics.constitution.regular) /
            10
    );
    charData.points.hitPoints = controlPoint(charData.points.hitPoints);
    charData.sanity.starting = charData.characteristics.power.regular;
    charData.combat = calculateCombat(charData);
    return charData;
};
