import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Box,
    TextField,
    Switch,
    FormControlLabel,
    IconButton
} from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';
import { CoCSkill } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import AutocompleteInput from '../../../autocompleteInput/AutocompleteInput';
import {
    SkillData,
    skillList,
    defaultSkillValue
} from './skills.data';

interface SkillAddProps {
    onSubmit: (data: CoCSkill) => void;
}

interface SkillAddErrors {
    name: boolean;
    base: boolean;
}

const defaultErrors = {
    name: false,
    base: false
};

const SkillAdd: React.FC<SkillAddProps> = ({ onSubmit }) => {
    const { T } = useApp();

    const [selectorValue, setSelectorValue] = useState<SkillData | null>(null);
    const [values, setValues] = useState<SkillData>(defaultSkillValue);
    const [errors, setErrors] = useState<SkillAddErrors>(defaultErrors);

    const controlForm = (): boolean => {
        const { name, base } = values;
        setErrors({
            name: !name,
            base: !base
        });
        return !!name && !!base;
    };

    const initialRender = useRef<boolean>(true);
    useEffect(() => {
        if (!initialRender.current) {
            const updatedErrors: Partial<SkillAddErrors> = {};
            if (values.name) { updatedErrors.name = false; }
            if (values.base) { updatedErrors.base = false; }
            setErrors((previous) => ({
                ...previous,
                ...updatedErrors
            }));
        } else {
            initialRender.current = false;
        }
    }, [values]);

    const onSelectorChange = (result: SkillData | null) => {
        setSelectorValue(result);
        if (result) {
            setValues(result);
        } else {
            setValues(defaultSkillValue);
        }
    };

    const translatedSkillList: SkillData[] = (
        skillList.map(({ key, base, development }) => ({
            name: T(`game.callOfCthulhu.skill.${key}`),
            base,
            development
        }))
    );

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 6">
                <AutocompleteInput<SkillData>
                    options={translatedSkillList}
                    defaultValue={defaultSkillValue}
                    label={T('game.callOfCthulhu.common.skill')}
                    value={selectorValue}
                    size="small"
                    error={errors.name}
                    onChange={onSelectorChange}
                />
            </Box>
            <Box gridColumn="span 2">
                <TextField
                    fullWidth
                    type="text"
                    size="small"
                    label={T('game.callOfCthulhu.common.base')}
                    value={values.base}
                    error={errors.base}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValues((previous) => ({
                            ...previous,
                            base: e.target.value
                        }));
                    }}
                />
            </Box>
            <Box gridColumn="span 3">
                <FormControlLabel
                    label={T('game.callOfCthulhu.common.development')}
                    labelPlacement="start"
                    control={(
                        <Switch
                            checked={values.development}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setValues((previous) => ({
                                    ...previous,
                                    development: e.target.checked
                                }));
                            }}
                        />
                    )}
                />
            </Box>
            <Box gridColumn="span 1">
                <IconButton
                    size="medium"
                    onClick={() => {
                        if (controlForm()) {
                            onSubmit({
                                ...defaultSkillValue,
                                ...values,
                                developed: false,
                                regular: 0,
                                half: 0,
                                fifth: 0
                            } as CoCSkill);
                            setSelectorValue(null);
                            setValues(defaultSkillValue);
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
