import {
    type SeventhSeaCharacter,
    type SeventhSeaSkills,
    type SeventhSeaTraits,
    type SeventhSeaBackground,
    type SeventhSeaStory,
    type SeventhSeaAdvantage
} from '@cthunline/games';

export const defaultBackground: SeventhSeaBackground = {
    name: '',
    description: '',
    quirk: ''
};

export const defaultStory: SeventhSeaStory = {
    name: '',
    goal: '',
    reward: '',
    steps: []
};

export const defaultAdvantage: SeventhSeaAdvantage = {
    name: '',
    description: ''
};

export const traitSkillLimiter = <DataType extends Record<string, number>>(
    data: DataType
): DataType =>
    Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
            let val = value;
            if (val < 1) {
                val = 1;
            }
            if (val > 5) {
                val = 5;
            }
            return [key, val];
        })
    ) as DataType;

export const controlCharacterData = (
    characterData: SeventhSeaCharacter
): SeventhSeaCharacter => ({
    ...characterData,
    traits: traitSkillLimiter<SeventhSeaTraits>(characterData.traits),
    skills: traitSkillLimiter<SeventhSeaSkills>(characterData.skills)
});
