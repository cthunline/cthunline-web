import {
    Select,
    SelectChangeEvent,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';

export interface SelectorOption {
    name: string;
    value: string | number;
}

interface SelectorProps {
    className?: string;
    size?: 'small' | 'medium';
    options: SelectorOption[];
    label?: string;
    name: string;
    value?: string;
    error?: string | boolean;
    onChange: (e: SelectChangeEvent) => void;
}

const Selector = ({
    className,
    size,
    options,
    label,
    name,
    value,
    error,
    onChange
}: SelectorProps) => {
    const selectorId = `selector-${name}`;

    return (
        <FormControl fullWidth error={!!error} size={size}>
            <InputLabel id={selectorId}>{label}</InputLabel>
            <Select
                size={size}
                className={className}
                labelId={selectorId}
                name={name}
                value={value ?? ''}
                label={label}
                onChange={onChange}
            >
                {options.map(({ name: optName, value: optValue }) => (
                    <MenuItem
                        key={`${selectorId}-${optValue}`}
                        value={optValue}
                    >
                        {optName}
                    </MenuItem>
                ))}
            </Select>
            {error && typeof error === 'string' ? (
                <FormHelperText>{error}</FormHelperText>
            ) : null}
        </FormControl>
    );
};

export default Selector;
