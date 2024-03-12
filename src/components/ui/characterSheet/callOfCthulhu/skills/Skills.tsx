import { Box } from '@mui/material';
import { CoCSkill } from '@cthunline/games';

import Skill from './Skill';
import SkillAdd from './SkillAdd';

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
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
    >
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
    </Box>
);

export default Skills;
