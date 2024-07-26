import type { GroupProps } from '@mantine/core';

import { PiTextT } from 'react-icons/pi';
import SizePicker from './SizePicker.js';

interface FontSizePickerProps extends Omit<GroupProps, 'onChange'> {
    onPick?: (fontSize: number) => void;
}

const FontSizePicker = ({ color, onPick, ...props }: FontSizePickerProps) => (
    <SizePicker
        {...props}
        color={color ?? 'white'}
        sizes={[16, 28, 40, 52, 64]}
        onPick={onPick}
        renderButtonContent={({ size }) => (
            <PiTextT size={(size + 32) * 0.25} />
        )}
    />
);

export default FontSizePicker;
