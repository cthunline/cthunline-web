import { Autocomplete, type AutocompleteProps } from '@mantine/core';
import { useMemo } from 'react';

import type { InputVariant } from './TextInput.js';

export interface AutocompleteInputValue<
    D extends { [f in F]: string },
    F extends string
> {
    label: string;
    data: D | null;
}

export interface AutocompleteInputProps<
    D extends { [f in F]: string },
    F extends string
> extends Omit<AutocompleteProps, 'data' | 'value' | 'onChange'> {
    variant?: InputVariant;
    data: D[];
    field: F;
    value: AutocompleteInputValue<D, F>;
    onChange: (val: AutocompleteInputValue<D, F>) => void;
}

const AutocompleteInput = <D extends { [f in F]: string }, F extends string>({
    variant,
    className,
    data,
    field,
    value,
    onChange,
    ...props
}: AutocompleteInputProps<D, F>) => {
    const [dataLabels, dataMap] = useMemo(() => {
        const labels: string[] = [];
        const map = new Map<string, D>();
        for (const dt of data) {
            if (dt[field]) {
                labels.push(dt[field]);
                map.set(dt[field], dt);
            }
        }
        return [labels, map];
    }, [data, field]);

    const onAutocompleteChange = (val: string) => {
        onChange({
            label: val,
            data: dataMap.get(val) ?? null
        });
    };

    return (
        <Autocomplete
            {...props}
            variant={variant === 'contained' ? 'default' : variant}
            className={`${className ?? ''} ${variant === 'contained' ? 'contained' : ''}`}
            data={dataLabels}
            value={value.label}
            onChange={onAutocompleteChange}
        />
    );
};

export default AutocompleteInput;
