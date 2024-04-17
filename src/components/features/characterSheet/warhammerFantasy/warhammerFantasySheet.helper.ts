import {
    type WarhammerFantasyCharacteristics,
    type WarhammerFantasyCharacter,
    type WarhammerFantasyWounds,
    type WarhammerFantasyCharacteristicName,
    type WarhammerFantasyCharacteristic,
    type WarhammerFantasyBasicSkills,
    type WarhammerFantasyBasicSkillName,
    type WarhammerFantasyOtherSkill,
    type WarhammerFantasyEncumbrance
} from '@cthunline/games';

export const getCharacteristicBonus = (
    char: WarhammerFantasyCharacteristic
): number => Math.floor(char.current / 10);

export const controlStatus = (
    partialChar: Partial<WarhammerFantasyCharacter>
): Partial<WarhammerFantasyCharacter> => {
    const char = { ...partialChar };
    if (char.experience) {
        char.experience = {
            ...char.experience,
            total: char.experience.current + char.experience.spent
        };
    }
    if (char.movement) {
        char.movement = {
            ...char.movement,
            walk: char.movement.movement * 2,
            run: char.movement.movement * 4
        };
    }
    return char;
};

export const controlWounds = (
    chars: WarhammerFantasyCharacteristics,
    wounds: WarhammerFantasyWounds
): WarhammerFantasyWounds => {
    const strengthBonus = getCharacteristicBonus(chars.strength);
    const twiceToughnessBonus = 2 * getCharacteristicBonus(chars.toughness);
    const willpowerBonus = getCharacteristicBonus(chars.willpower);
    const hardyValue = wounds.hardy
        ? getCharacteristicBonus(chars.toughness)
        : 0;
    const total =
        strengthBonus + twiceToughnessBonus + willpowerBonus + hardyValue;
    const current = wounds.current > total ? total : wounds.current;
    return {
        strengthBonus,
        twiceToughnessBonus,
        willpowerBonus,
        hardy: wounds.hardy,
        total,
        current,
        notes: wounds.notes
    };
};

const sumEncumbrance = (items: { encumbrance: number }[]) => {
    let sum = 0;
    items.forEach(({ encumbrance }) => {
        sum += encumbrance;
    });
    return sum;
};

export const controlEncumbrance = (
    character: WarhammerFantasyCharacter
): WarhammerFantasyEncumbrance => {
    const strengthBonus = getCharacteristicBonus(
        character.characteristics.strength
    );
    const toughnessBonus = getCharacteristicBonus(
        character.characteristics.toughness
    );
    const { maximumBonus } = character.encumbrance;
    const maximum = strengthBonus + toughnessBonus + maximumBonus;
    const weapons = sumEncumbrance(character.weapons);
    const armour = sumEncumbrance(character.armour);
    const trappings = sumEncumbrance(character.trappings);
    const total = weapons + armour + trappings;
    return {
        weapons,
        armour,
        trappings,
        total,
        maximumBonus,
        maximum
    };
};

export type ControlItemsSortOnly = 'weapons' | 'trappings' | 'armour';

export const controlItems = (
    character: WarhammerFantasyCharacter
): WarhammerFantasyCharacter => ({
    ...character,
    encumbrance: controlEncumbrance(character)
});

export const controlSkills = (
    characteristics: WarhammerFantasyCharacteristics,
    basicSkills: WarhammerFantasyBasicSkills,
    otherSkills: WarhammerFantasyOtherSkill[]
): WarhammerFantasyBasicSkills => {
    const calculatedSkills: WarhammerFantasyBasicSkills = { ...basicSkills };
    (Object.keys(calculatedSkills) as WarhammerFantasyBasicSkillName[]).forEach(
        (skillName) => {
            const basicSkill = calculatedSkills[skillName];
            const char = characteristics[basicSkill.characteristicName];
            calculatedSkills[skillName].skill =
                char.current + basicSkill.advances;
        }
    );
    const calculatedOtherSkills = [...otherSkills];
    calculatedOtherSkills.forEach((otherSkill, index) => {
        const char = characteristics[otherSkill.characteristicName];
        calculatedOtherSkills[index].skill = char.current + otherSkill.advances;
    });
    return calculatedSkills;
};

export const sortOtherSkills = (
    character: WarhammerFantasyCharacter
): WarhammerFantasyCharacter => {
    const { otherSkills } = character;
    return {
        ...character,
        otherSkills
    };
};

export const controlCharacteristic = (
    char: WarhammerFantasyCharacteristic
): WarhammerFantasyCharacteristic => ({
    ...char,
    current: char.initial + char.advances
});

export const controlCharacteristics = (
    character: WarhammerFantasyCharacter
): WarhammerFantasyCharacter => {
    const calculatedChars: WarhammerFantasyCharacteristics = {
        ...character.characteristics
    };
    (
        Object.keys(calculatedChars) as WarhammerFantasyCharacteristicName[]
    ).forEach((char) => {
        calculatedChars[char] = controlCharacteristic(calculatedChars[char]);
    });
    return {
        ...character,
        characteristics: calculatedChars,
        wounds: controlWounds(calculatedChars, character.wounds),
        basicSkills: controlSkills(
            calculatedChars,
            character.basicSkills,
            character.otherSkills
        ),
        encumbrance: controlEncumbrance(character)
    };
};
