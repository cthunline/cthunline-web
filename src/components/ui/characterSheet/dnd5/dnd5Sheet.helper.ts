import {
    DnD5Character,
    DnD5Abilities,
    DnD5Skills,
    DnD5Ability
} from '@cthunline/games';

export const displayModifier = (modifier: number): string => (
    `${modifier >= 0 ? '+' : ''}${modifier}`
);

export const calculateAbility = (ability: DnD5Ability): DnD5Ability => ({
    ...ability,
    modifier: Math.floor((ability.score - 10) / 2)
});

export const calculateAbilities = (characterData: DnD5Character): DnD5Character => {
    const abilities = { ...characterData.abilities };
    const abilityKeys = Object.keys(abilities) as (keyof DnD5Abilities)[];
    abilityKeys.forEach((abilityKey) => {
        abilities[abilityKey] = calculateAbility(
            abilities[abilityKey]
        );
    });
    return {
        ...characterData,
        abilities
    };
};

export const skillAbilities: Record<keyof DnD5Skills, keyof DnD5Abilities> = {
    acrobatics: 'dexterity',
    animalHandling: 'wisdom',
    arcana: 'intelligence',
    athletics: 'strength',
    deception: 'charisma',
    history: 'intelligence',
    insight: 'wisdom',
    intimidation: 'charisma',
    investigation: 'intelligence',
    medicine: 'wisdom',
    nature: 'intelligence',
    perception: 'wisdom',
    performance: 'charisma',
    persuasion: 'charisma',
    religion: 'intelligence',
    sleightOfHand: 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom'
};

export const calculateSkills = (characterData: DnD5Character): DnD5Character => {
    const {
        abilities,
        statistics: {
            proficiencyBonus
        }
    } = characterData;
    const skills = { ...characterData.skills };
    const skillKeys = Object.keys(skills) as (keyof DnD5Skills)[];
    skillKeys.forEach((skillKey) => {
        const { proficient } = skills[skillKey];
        const abilityModifier = abilities[skillAbilities[skillKey]].modifier;
        skills[skillKey].modifier = (
            proficient ? (
                abilityModifier + proficiencyBonus
            ) : abilityModifier
        );
    });
    return {
        ...characterData,
        skills
    };
};

export const calculateSavingThrows = (characterData: DnD5Character): DnD5Character => {
    const {
        abilities,
        statistics: {
            proficiencyBonus
        }
    } = characterData;
    const savingThrows = { ...characterData.savingThrows };
    const savingThrowKeys = Object.keys(savingThrows) as (keyof DnD5Abilities)[];
    savingThrowKeys.forEach((ability) => {
        const { proficient } = savingThrows[ability];
        const abilityModifier = abilities[ability].modifier;
        savingThrows[ability].modifier = (
            proficient ? abilityModifier : (
                abilityModifier + proficiencyBonus
            )
        );
    });
    return {
        ...characterData,
        savingThrows
    };
};

export const calculateOtherStats = (characterData: DnD5Character): DnD5Character => ({
    ...characterData,
    combat: {
        ...characterData.combat,
        initiative: characterData.abilities.dexterity.modifier
    },
    statistics: {
        ...characterData.statistics,
        passiveWisdom: 10 + characterData.skills.perception.modifier
    }
});

export const controlCharacterData = (characterData: DnD5Character): DnD5Character => (
    calculateOtherStats(
        calculateSkills(
            calculateSavingThrows(
                calculateAbilities(
                    characterData
                )
            )
        )
    )
);
