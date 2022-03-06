import React, { useState } from 'react';
import {
    Box,
    TextField,
    Switch,
    FormControlLabel,
    IconButton
} from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';

interface SkillAddProps {
    handleCreate: (data: CoCSkill) => void;
}

const SkillAdd: React.FC<SkillAddProps> = ({ handleCreate }) => {
    const [name, setName] = useState<string>('');
    const [base, setBase] = useState<string>('');
    const [development, setDevelopment] = useState<boolean>(true);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
        >
            <Box gridColumn="span 6" display="grid" alignItems="center">
                <TextField
                    fullWidth
                    type="text"
                    size="small"
                    label="Skill Name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value);
                    }}
                />
            </Box>
            <Box gridColumn="span 2" display="grid" alignItems="center">
                <TextField
                    fullWidth
                    type="text"
                    size="small"
                    label="Base"
                    value={base}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setBase(e.target.value);
                    }}
                />
            </Box>
            <Box gridColumn="span 3" alignItems="center">
                <FormControlLabel
                    label="Development"
                    labelPlacement="start"
                    control={(
                        <Switch
                            checked={development}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDevelopment(e.target.checked);
                            }}
                        />
                    )}
                />
            </Box>
            <Box gridColumn="span 1" alignItems="center">
                <IconButton
                    size="medium"
                    onClick={() => handleCreate({
                        name,
                        base,
                        development,
                        developed: false,
                        regular: 0,
                        half: 0,
                        fifth: 0
                    })}
                >
                    <FiPlusCircle />
                </IconButton>
            </Box>
        </Box>
    );
};

export default SkillAdd;
