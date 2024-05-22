import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';

type RowInputProps = {
    readonly: boolean;
    label?: string;
    center?: boolean;
    w?: string;
    flex?: string;
} & (
    | {
          type: 'string';
          value: string;
          onChange?: (value: string) => void;
      }
    | {
          type: 'number';
          value: number;
          onChange?: (value: number) => void;
      }
);

const RowInput = ({
    readonly,
    center,
    w,
    flex,
    type,
    label,
    value,
    onChange
}: RowInputProps) => (
    <TextInput
        variant="contained"
        w={w ?? (flex ? undefined : '100%')}
        flex={flex}
        readOnly={readonly}
        center={center}
        ta={type === 'number' ? 'center' : undefined}
        size="sm"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === 'number') {
                onChange?.(Number(onlyNumbers(e.target.value)));
            } else {
                onChange?.(e.target.value);
            }
        }}
    />
);

export default RowInput;
