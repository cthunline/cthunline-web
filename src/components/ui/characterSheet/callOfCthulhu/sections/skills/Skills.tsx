import React, { useState, useEffect } from 'react';
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
    const [skills, setSkills] = useState<CoCSkill[]>(data.skills);

    const handleChange = (
        index: number,
        key: keyof CoCSkill,
        value: string | number | boolean
    ) => {
        skills[index] = controlSkill({
            ...skills[index],
            [key]: value
        });
        setSkills(skills);
    };

    useEffect(() => {
        if (onChange) {
            onChange({
                ...data,
                skills
            });
        }
    }, [
        onChange,
        data,
        skills
    ]);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {skills.map((skill, idx) => (
                <Skill
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
