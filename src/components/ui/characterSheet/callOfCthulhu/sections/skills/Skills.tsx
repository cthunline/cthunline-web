import React from 'react';
import { Box } from '@mui/material';

import { CharacterSheetContentProps } from '../../../characterSheetProps';
import { CoCSkill, CoCCharacterData } from '../../../../../../types/games/callOfCthulhu';
// import { skillList } from './skills.data';
import { controlSkill } from './skills.helper';
import Skill from './Skill';

const Skills: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    data,
    readonly,
    onChange
}) => {
    const handleChange = (
        index: number,
        key: keyof CoCSkill,
        value: string | number | boolean
    ) => {
        const updatedSkills = [...data.skills];
        updatedSkills[index] = controlSkill({
            ...data.skills[index],
            [key]: value
        });
        onChange?.({
            ...data,
            skills: updatedSkills
        });
    };

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {data.skills.map((skill, idx) => (
                <Skill
                    key={`skill-${idx.toString()}`}
                    index={idx}
                    data={skill}
                    readonly={readonly}
                    handleChange={handleChange}
                />
            ))}
            {/*
            TODO
            https://mui.com/components/autocomplete/#creatable
            add a creatable input to add a new skill
            set skillList as datalist on the input
            add another input to set base
            if new skill is selected from the datalist fill the base input
            add a button + to add the skill then empty the create inputs
            new added skills have development to true
            */}
        </Box>
    );
};

export default Skills;
