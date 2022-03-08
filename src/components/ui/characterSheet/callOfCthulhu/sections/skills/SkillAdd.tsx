import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    TextField,
    Switch,
    FormControlLabel,
    IconButton
} from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';

import { CoCSkill } from '../../../../../../types/games/callOfCthulhu';
import SkillSelector from './SkillSelector';

interface SkillAddProps {
    onSubmit: (data: CoCSkill) => void;
}

interface SelectorResult {
    name: string;
    base: string;
    development: boolean;
}

const SkillAdd: React.FC<SkillAddProps> = ({ onSubmit }) => {
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<boolean>(false);
    const [base, setBase] = useState<string>('');
    const [baseError, setBaseError] = useState<boolean>(false);
    const [development, setDevelopment] = useState<boolean>(true);

    const controlForm = (): boolean => {
        if (!name) { setNameError(true); }
        if (!base) { setBaseError(true); }
        return !!name && !!base;
    };

    const resetForm = () => {
        setName('');
        setNameError(false);
        setBase('');
        setBaseError(false);
        setDevelopment(true);
    };

    useEffect(() => {
        if (name) { setNameError(false); }
        if (base) { setBaseError(false); }
    }, [
        name,
        base
    ]);

    const onSelectorChange = useCallback((result: SelectorResult | null) => {
        if (result) {
            setName(result.name);
            setBase(result.base);
            setDevelopment(result.development);
        } else {
            resetForm();
        }
    }, []);

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
        >
            <Box gridColumn="span 6" display="grid" alignItems="center">
                <SkillSelector
                    label="Select or create Skill"
                    size="small"
                    error={nameError}
                    onChange={onSelectorChange}
                />
            </Box>
            <Box gridColumn="span 2" display="grid" alignItems="center">
                <TextField
                    fullWidth
                    type="text"
                    size="small"
                    label="Base"
                    value={base}
                    error={baseError}
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
                    onClick={() => {
                        if (controlForm()) {
                            resetForm();
                            onSubmit({
                                name,
                                base,
                                development,
                                developed: false,
                                regular: 0,
                                half: 0,
                                fifth: 0
                            });
                        }
                    }}
                >
                    <FiPlusCircle />
                </IconButton>
            </Box>
        </Box>
    );
};

export default SkillAdd;
