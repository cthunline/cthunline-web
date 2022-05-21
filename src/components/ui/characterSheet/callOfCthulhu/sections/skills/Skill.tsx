import React, { memo } from 'react';
import {
    Box,
    TextField,
    Checkbox,
    IconButton
} from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { CoCSkill } from '@cthunline/games';

import { useApp } from '../../../../../contexts/App';
import { onlyNumbers } from '../../../../../../services/tools';
import { skillKeys } from './skills.data';
import { controlSkill } from '../../cocSheet.helper';

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
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 1">
                {data.development ? (
                    <Checkbox
                        checked={data.developed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!readonly) {
                                onChange(
                                    index,
                                    controlSkill({
                                        ...data,
                                        developed: e.target.checked
                                    })
                                );
                            }
                        }}
                    />
                ) : null}
            </Box>
            <Box gridColumn={`span ${readonly ? '6' : '5'}`}>
                {data.name}
            </Box>
            <Box gridColumn="span 2">
                <TextField
                    fullWidth
                    disabled
                    type="text"
                    size="small"
                    label={T('game.callOfCthulhu.common.base')}
                    value={data.base}
                />
            </Box>
            {skillKeys.map(({ key, textKey, editable }) => (
                <Box key={key.toString()} gridColumn="span 1">
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={T(`game.callOfCthulhu.common.${textKey}`)}
                        value={data[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                index,
                                controlSkill({
                                    ...data,
                                    [key]: Number(onlyNumbers(e.target.value))
                                })
                            );
                        }}
                    />
                </Box>
            ))}
            {readonly ? null : (
                <Box gridColumn="span 1">
                    <IconButton
                        size="medium"
                        color="error"
                        onClick={() => onDelete(index)}
                    >
                        <MdOutlineDeleteOutline />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default memo(Skill);
