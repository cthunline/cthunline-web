import React, { memo } from 'react';
import { Box, TextField, Checkbox } from '@mui/material';

import { displayModifier } from '../dnd5Sheet.helper';

interface ModifierRowProps {
    readonly?: boolean;
    text: string;
    modifier: number;
    proficient: boolean;
    onProficientChange: (proficient: boolean) => void;
}

const ModifierRow: React.FC<ModifierRowProps> = ({
    readonly,
    text,
    modifier,
    proficient,
    onProficientChange
}) => (
    <>
        <Box gridColumn="span 7">
            {text}
        </Box>
        <Box gridColumn="span 3">
            <TextField
                fullWidth
                InputProps={{
                    readOnly: true,
                    classes: {
                        input: 'input-smaller-text'
                    }
                }}
                type="text"
                size="small"
                value={displayModifier(modifier)}
            />
        </Box>
        <Box gridColumn="span 2">
            <Checkbox
                checked={proficient}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readonly) {
                        onProficientChange(e.target.checked);
                    }
                }}
            />
        </Box>
    </>
);

export default memo(ModifierRow);
