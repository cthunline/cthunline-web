import React from 'react';
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';

interface AutocompleteInputProps<DataType> {
    options: (DataType & AutocompleteInputData)[];
    defaultValue: DataType;
    label: string;
    value: DataType | null;
    onChange: (value: DataType | null) => void;
    size?: 'medium' | 'small';
    error?: boolean;
    variant?: 'outlined' | 'standard' | 'filled';
}

interface AutocompleteInputData {
    inputValue?: string;
    name: string;
}

const AutocompleteInput = <DataType extends AutocompleteInputData>({
    options,
    defaultValue,
    label,
    value,
    onChange,
    size,
    error,
    variant = 'outlined'
}: AutocompleteInputProps<DataType>) => {
    const filter = createFilterOptions<DataType>();

    return (
        <Autocomplete
            size={size}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            freeSolo
            value={value}
            options={options}
            renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={error}
                    label={label}
                    variant={variant}
                />
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
            filterOptions={(optionList, params) => {
                const filtered = filter(optionList, params);
                const { inputValue } = params;
                const isExisting = optionList.some((option) => (
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
};

export default AutocompleteInput;
