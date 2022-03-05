import React from 'react';
import { Box } from '@mui/material';

import { CharacterSheetContentProps } from '../../../characterSheetProps';
import { CoCSkill, CoCCharacterData } from '../../../../../../types/games/callOfCthulhu';
import Skill from './Skill';

const Skills: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    data,
    readonly,
    onChange
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
    >
        {data.skills.map((skill, index) => (
            <Skill
                key={`skill-${index.toString()}`}
                data={skill}
                readonly={readonly}
                handleChange={(skillData: CoCSkill) => {
                    const updatedData = { ...data };
                    updatedData.skills[index] = skillData;
                    onChange?.(updatedData);
                }}
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

export default Skills;
