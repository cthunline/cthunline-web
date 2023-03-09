import React, { memo } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { SWD6Attribute, SWD6Skill } from '@cthunline/games';

import { skillFields } from './skills.data';

interface SkillProps {
    attribute: SWD6Attribute;
    index: number;
    data: SWD6Skill;
    readonly: boolean;
    onChange: (
        attribute: SWD6Attribute,
        index: number,
        data: SWD6Skill
    ) => void;
    onDelete: (attribute: SWD6Attribute, index: number) => void;
}

const Skill: React.FC<SkillProps> = ({
    attribute,
    index,
    data,
    readonly,
    onChange,
    onDelete
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(15, 1fr)"
    >
        <Box
            gridColumn={`span ${readonly ? 15 : 13}`}
            display="grid"
            gridTemplateColumns="repeat(16, 1fr)"
            alignItems="center"
            gap={2}
        >
            {skillFields.map(({ gridColumn, key }) => (
                <Box key={`skill-${key}`} gridColumn={`span ${gridColumn}`}>
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly,
                            classes: {
                                input: 'input-smaller-text'
                            }
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
        {readonly ? null : (
            <Box
                className="text-center"
                gridColumn="span 2"
                alignItems="center"
            >
                <IconButton
                    size="medium"
                    color="error"
                    onClick={() => onDelete(attribute, index)}
                >
                    <MdOutlineDeleteOutline />
                </IconButton>
            </Box>
        )}
    </Box>
);

export default memo(Skill);
