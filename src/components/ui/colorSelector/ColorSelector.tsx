import { Box } from '@mui/material';

import { Color, colors } from '../../../types';

import './ColorSelector.css';

interface ColorSelectorProps {
    className?: string;
    onChange?: (color: Color) => void;
}

const ColorSelector = ({ className, onChange }: ColorSelectorProps) => (
    <Box
        className={`color-selector p-5 ${className}`}
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={1}
    >
        {colors.map((color: Color) => (
            <Box
                key={`color-selector-${color}`}
                className="color-selector-color clickable"
                style={{ background: `var(--palette-${color})` }}
                gridColumn="span 4"
                onClick={() => onChange?.(color)}
            />
        ))}
    </Box>
);

export default ColorSelector;
