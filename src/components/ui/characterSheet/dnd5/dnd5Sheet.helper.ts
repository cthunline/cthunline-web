import {
    DnD5Character,
    DnD5Abilities,
    DnD5Skills
} from '@cthunline/games';

export const calculateAbilities = (characterData: DnD5Character): DnD5Character => {
    const abilities = { ...characterData.abilities };
    const abilityKeys = Object.keys(abilities) as (keyof DnD5Abilities)[];
    abilityKeys.forEach((abilityKey) => {
        const { score } = abilities[abilityKey];
        abilities[abilityKey].modifier = (
            Math.floor((score - 10) / 2)
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
            proficient ? abilityModifier : (
                abilityModifier + proficiencyBonus
            )
        );
    });
    return {
        ...characterData,
        skills
    };
};

export const calculateCombat = (characterData: DnD5Character): DnD5Character => ({
    ...characterData,
    combat: {
        ...characterData.combat,
        initiative: characterData.abilities.dexterity.modifier
    }
});

export const calculateStatistics = (characterData: DnD5Character): DnD5Character => ({
    ...characterData,
    statistics: {
        ...characterData.statistics,
        passiveWisdom: 10 + characterData.skills.perception.modifier
    }
});

export const controlCharacterData = (characterData: DnD5Character): DnD5Character => (
    calculateAbilities(
        calculateSkills(
            calculateCombat(
                calculateStatistics(
                    characterData
                )
            )
        )
    )
);
