import React, { memo } from 'react';
import {
    Box,
    TextField,
    Checkbox,
    IconButton
} from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';
import { skillKeys } from './skills.data';
import { controlSkill } from './skills.helper';

interface SkillProps {
    index: number;
    data: CoCSkill;
    readonly: boolean;
    onChange: (index: number, data: CoCSkill) => void;
    onDelete: (index: number) => void;
}

const Skill: React.FC<SkillProps> = ({
    index,
    data,
    readonly,
    onChange,
    onDelete
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
                        onChange(
                            index,
                            controlSkill({
                                ...data,
                                developed: e.target.checked
                            })
                        );
                    }}
                />
            ) : null}
        </Box>
        <Box gridColumn="span 5" display="grid" alignItems="center">
            {data.name}
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
                    onChange(
                        index,
                        controlSkill({
                            ...data,
                            base: e.target.value
                        })
                    );
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
                        onChange(
                            index,
                            controlSkill({
                                ...data,
                                [key]: Number(e.target.value)
                            })
                        );
                    }}
                />
            </Box>
        ))}
        <Box gridColumn="span 1" alignItems="center">
            <IconButton
                size="medium"
                color="error"
                onClick={() => onDelete(index)}
            >
                <MdOutlineDeleteOutline />
            </IconButton>
        </Box>
    </Box>
);

export default memo(Skill);