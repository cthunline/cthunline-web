import React from 'react';
import { Box, TextField, Checkbox } from '@mui/material';

import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';
import { skillKeys } from './skills.data';

interface SkillProps {
    index: number;
    data: CoCSkill;
    readonly: boolean;
    handleChange: (
        index: number,
        key: keyof CoCSkill,
        value: string | number | boolean
    ) => void;
}

const Skill: React.FC<SkillProps> = ({
    index,
    data,
    readonly,
    handleChange
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
    >
        <Box gridColumn="span 1" display="grid" alignItems="center">
            {data.development ? (
                <Checkbox
                    checked={data.developed}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(index, 'developed', e.target.checked);
                    }}
                />
            ) : null}
        </Box>
        <Box gridColumn="span 6" display="grid" alignItems="center">
            <TextField
                fullWidth
                InputProps={{
                    readOnly: readonly
                }}
                type="text"
                size="small"
                value={data.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index, 'name', e.target.value);
                }}
            />
        </Box>
        <Box gridColumn="span 2" display="grid" alignItems="center">
            <TextField
                fullWidth
                InputProps={{
                    readOnly: readonly
                }}
                type="text"
                size="small"
                label="Base"
                value={data.base}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index, 'base', e.target.value);
                }}
            />
        </Box>
        {skillKeys.map(({ key, label, editable }) => (
            <Box
                key={key.toString()}
                gridColumn="span 1"
                alignItems="center"
            >
                <TextField
                    fullWidth
                    disabled={!editable}
                    InputProps={{
                        readOnly: readonly
                    }}
                    type="text"
                    size="small"
                    label={label}
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(index, key, Number(e.target.value));
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default Skill;
