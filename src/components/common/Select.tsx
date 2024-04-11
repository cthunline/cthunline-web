import { useMemo } from 'react';
import {
    type ComboboxItem,
    Select as MantineSelect,
    type SelectProps as MantineSelectProps
} from '@mantine/core';

import { type InputVariant } from './TextInput.js';
import {
    type SelectOption,
    type SelectOptionGroup
} from '../../types/index.js';

type SelectProps = Omit<
    MantineSelectProps,
    'variant' | 'data' | 'defaultValue' | 'value' | 'onChange'
> & {
    variant?: InputVariant;
} & (
        | {
              valueType?: 'string';
              options: (SelectOption<string> | SelectOptionGroup<string>)[];
              defaultValue?: string | null;
              value?: string | null;
              onChange?: (
                  value: string | null,
                  option: SelectOption<string> | null
              ) => void;
          }
        | {
              valueType: 'number';
              options: (SelectOption<number> | SelectOptionGroup<number>)[];
              defaultValue?: number | null;
              value?: number | null;
              onChange?: (
                  value: number | null,
                  option: SelectOption<number> | null
              ) => void;
          }
    );

const isGroupOption = (
    option: SelectOption<string | number> | SelectOptionGroup<string | number>
): option is SelectOptionGroup<string | number> =>
    Object.hasOwn(option, 'group') && Object.hasOwn(option, 'items');

const Select = ({
    variant,
    className,
    valueType,
    options,
    defaultValue,
    value,
    onChange,
    ...props
}: SelectProps) => {
    const stringDefaultValue = defaultValue?.toString();
    const stringValue = value?.toString();

    const data = useMemo(
        (): (SelectOption<string> | SelectOptionGroup<string>)[] =>
            valueType === 'number'
                ? options.map((option) => {
                      if (isGroupOption(option)) {
                          return {
                              ...option,
                              items: option.items.map((item) => ({
                                  ...item,
                                  value: item.value.toString()
                              }))
                          };
                      }
                      return {
                          ...option,
                          value: option.value.toString()
                      };
                  })
                : options,
        [valueType, options]
    );

    const handleChange = (val: string | null, option: ComboboxItem) => {
        if (onChange) {
            if (valueType === 'number') {
                onChange(Number(val), {
                    ...option,
                    value: Number(option.value)
                });
            } else {
                onChange(val, option);
            }
        }
    };

    return (
        <MantineSelect
            {...props}
            variant={variant === 'contained' ? 'default' : variant}
            className={`${className ?? ''} ${variant === 'contained' ? 'contained' : ''}`}
            data={data}
            defaultValue={stringDefaultValue}
            value={stringValue}
            onChange={handleChange}
        />
    );
};

export default Select;
