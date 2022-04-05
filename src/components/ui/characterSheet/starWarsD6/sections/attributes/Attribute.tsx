import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import Skill from './Skill';
import SkillAdd from './SkillAdd';
import {
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill
} from '../../../../../../types/games/starWarsD6';
import { ucfirst } from '../../../../../../services/tools';

import './Attribute.css';

interface AttributeProps {
    attribute: SWD6Attribute;
    data: SWD6AttributeData;
    readonly: boolean;
    onChange: (attribute: SWD6Attribute, data: SWD6AttributeData) => void;
    onSkillCreate: (attribute: SWD6Attribute, data: SWD6Skill) => void;
    onSkillChange: (attribute: SWD6Attribute, index: number, data: SWD6Skill) => void;
}

const Attribute: React.FC<AttributeProps> = ({
    attribute,
    data,
    readonly,
    onChange,
    onSkillCreate,
    onSkillChange
}) => (
    <Box
        gridColumn="span 6"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        alignItems="start"
        rowGap={1}
        columnGap={2}
    >
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(16, 1fr)"
            alignItems="center"
            rowGap={1}
            columnGap={2}
        >
            <Box className="attribute-name" gridColumn="span 11">
                {ucfirst(attribute)}
            </Box>
            <Box gridColumn="span 5">
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    value={data.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(attribute, {
                            ...data,
                            value: e.target.value
                        });
                    }}
                />
            </Box>
        </Box>
        {data.skills.map((skill, index) => (
            <Skill
                key={`skill-${attribute}-${index.toString()}`}
                attribute={attribute}
                index={index}
                data={skill}
                readonly={readonly}
                onChange={onSkillChange}
            />
        ))}
        <SkillAdd
            attribute={attribute}
            onSubmit={onSkillCreate}
        />
    </Box>
);

export default memo(Attribute);
