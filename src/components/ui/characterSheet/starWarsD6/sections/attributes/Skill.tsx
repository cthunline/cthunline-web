import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import {
    SWD6Attribute,
    SWD6Skill
} from '../../../../../../types/games/starWarsD6';
import { skillFields } from './skills.data';

interface SkillProps {
    attribute: SWD6Attribute;
    index: number;
    data: SWD6Skill;
    readonly: boolean;
    onChange: (attribute: SWD6Attribute, index: number, data: SWD6Skill) => void;
}

const Skill: React.FC<SkillProps> = ({
    attribute,
    index,
    data,
    readonly,
    onChange
}) => (
    <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
        {skillFields.map(({ gridColumn, key }) => (
            <Box key={`skill-${key}`} gridColumn={`span ${gridColumn}`}>
                <TextField
                    fullWidth
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(attribute, index, {
                            ...data,
                            [key]: e.target.value
                        });
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Skill);
