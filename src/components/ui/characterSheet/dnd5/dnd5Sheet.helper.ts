import {
    DnD5Character,
    DnD5Abilities,
    DnD5Skills,
    DnD5Ability,
    DnD5SpellLevel
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

export const forcePositive = (num: number): number => (
    num >= 0 ? num : 0
);

export const controlDeathSave = (amount: number): number => {
    if (amount < 0) {
        return 0;
    }
    if (amount > 3) {
        return 3;
    }
    return amount;
};

export const sortSpellLevels = (levels: DnD5SpellLevel[]) => (
    levels.sort((a, b) => (
        a.level - b.level
    ))
);

export const calculateOtherStats = (characterData: DnD5Character): DnD5Character => {
    const {
        abilities: {
            dexterity: {
                modifier: dexterityModifier
            }
        },
        skills: {
            perception: {
                modifier: perceptionModifier
            }
        },
        combat: {
            speed,
            deathSaves: {
                successes: deathSaveSuccesses,
                failures: deathSaveFailures
            },
            hitPoints: {
                current: currentHP,
                maximum: maximumHP,
                temporary: temporaryHP
            }
        }
    } = characterData;
    return {
        ...characterData,
        combat: {
            ...characterData.combat,
            initiative: dexterityModifier,
            speed: forcePositive(speed),
            deathSaves: {
                successes: controlDeathSave(deathSaveSuccesses),
                failures: controlDeathSave(deathSaveFailures)
            },
            hitPoints: {
                current: currentHP > maximumHP ? maximumHP : forcePositive(currentHP),
                maximum: forcePositive(maximumHP),
                temporary: forcePositive(temporaryHP)
            }
        },
        statistics: {
            ...characterData.statistics,
            passiveWisdom: 10 + perceptionModifier
        },
        spellcasting: {
            ...characterData.spellcasting,
            levels: sortSpellLevels(characterData.spellcasting.levels)
        }
    };
};

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
