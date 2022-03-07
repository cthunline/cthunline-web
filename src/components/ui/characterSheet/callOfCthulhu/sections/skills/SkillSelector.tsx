import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

import { skillList } from './skills.data';

interface SkillSelectorProps {
    onChange: (value: SkillSelectorData) => void;
}

interface SkillSelectorData {
    inputValue?: string;
    name: string;
    base: string;
    development: boolean;
}

const filter = createFilterOptions<SkillSelectorData>();

const defaultValue = {
    name: '',
    base: '',
    development: true
};

const SkillSelector: React.FC<SkillSelectorProps> = ({ onChange }) => {
    const [value, setValue] = useState<SkillSelectorData>(defaultValue);

    useEffect(() => {
        onChange(value);
    }, [
        value,
        onChange
    ]);

    return (
        <Autocomplete
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            value={value}
            options={skillList as SkillSelectorData[]}
            renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
            )}
            renderInput={(params) => (
                <TextField {...params} label="Skill Name" />
            )}
            onChange={(e, val) => {
                if (val && typeof val === 'object') {
                    if (val.name) {
                        setValue(val);
                    } else if (val.inputValue) {
                        setValue({
                            ...defaultValue,
                            name: val.inputValue
                        });
                    }
                } else if (typeof val === 'string') {
                    setValue({
                        ...defaultValue,
                        name: String(val)
                    });
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => (
                    inputValue === option.name
                ));
                if (inputValue && !isExisting) {
                    filtered.push({
                        ...defaultValue,
                        inputValue,
                        name: `Add "${inputValue}"`
                    });
                }
                return filtered;
            }}
            getOptionLabel={(option) => {
                if (typeof option === 'string') {
                    return option;
                }
                if (option.inputValue) {
                    return option.inputValue;
                }
                return option.name;
            }}
        />
    );
};

export default SkillSelector;
