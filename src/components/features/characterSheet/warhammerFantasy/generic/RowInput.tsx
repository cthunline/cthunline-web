import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';

type RowInputProps = {
    readonly: boolean;
    label?: string;
    center?: boolean;
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
    type,
    label,
    value,
    onChange
}: RowInputProps) => (
    <TextInput
        variant="contained"
        w="100%"
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
