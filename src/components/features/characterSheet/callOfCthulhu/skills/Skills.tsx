import type { CoCSkill } from '@cthunline/games';
import { Stack } from '@mantine/core';

import Skill from './Skill.js';
import SkillAdd from './SkillAdd.js';

interface SkillsProps {
    skills: CoCSkill[];
    readonly: boolean;
    onChange: (index: number, data: CoCSkill) => void;
    onDelete: (index: number) => void;
    onCreate: (data: CoCSkill) => void;
}

const Skills = ({
    skills,
    readonly,
    onChange,
    onDelete,
    onCreate
}: SkillsProps) => (
    <Stack w="100%" gap="1.5rem">
        {skills.map((skill, index) => (
            <Skill
                key={`skill-${index.toString()}`}
                index={index}
                data={skill}
                readonly={readonly}
                onChange={onChange}
                onDelete={onDelete}
            />
        ))}
        {!readonly ? <SkillAdd onSubmit={onCreate} /> : null}
    </Stack>
);

export default Skills;
