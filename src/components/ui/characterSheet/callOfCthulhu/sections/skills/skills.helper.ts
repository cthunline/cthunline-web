import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';

// eslint-disable-next-line import/prefer-default-export
export const controlSkill = (skillData: CoCSkill): CoCSkill => {
    const skill = skillData;
    skill.half = Math.floor(skill.regular / 2);
    skill.fifth = Math.floor(skill.regular / 5);
    return skill;
};

export const controlSkills = (skills: CoCSkill[]): CoCSkill[] => (
    skills.sort((a, b) => (
        a.name.localeCompare(b.name)
    ))
);
