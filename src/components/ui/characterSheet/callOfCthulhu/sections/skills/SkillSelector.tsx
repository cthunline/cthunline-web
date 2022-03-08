import React from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

import { skillList } from './skills.data';

interface SkillSelectorProps {
    label: string;
    value: SkillSelectorData | null;
    onChange: (value: SkillSelectorData | null) => void;
    size?: 'medium' | 'small';
    error?: boolean;
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

const SkillSelector: React.FC<SkillSelectorProps> = ({
    label,
    value,
    onChange,
    size,
    error
}) => (
    <Autocomplete
        size={size}
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
            <TextField {...params} error={error} label={label} />
        )}
        onChange={(e, val) => {
            if (val && typeof val === 'object') {
                if (val.inputValue) {
                    onChange({
                        ...defaultValue,
                        name: val.inputValue
                    });
                } else if (val.name) {
                    onChange(val);
                }
            } else if (typeof val === 'string') {
                onChange({
                    ...defaultValue,
                    name: String(val)
                });
            } else {
                onChange(null);
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
                    name: `Add "${inputValue}"`,
                    inputValue
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

export default SkillSelector;
