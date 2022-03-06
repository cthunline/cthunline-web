import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';

import { CoCCharacterData, CoCBiography } from '../../../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../../../characterSheetProps';
import { fields } from './biography.data';

const Biography: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => {
    const [biography, setBiography] = useState<CoCBiography>(
        data.biography
    );

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            {fields.map(({
                field,
                label,
                type,
                grid
            }) => (
                <Box key={field} gridColumn={`span ${grid}`}>
                    <TextField
                        fullWidth
                        InputProps={{ readOnly: readonly }}
                        type={type ?? 'text'}
                        size="small"
                        label={label}
                        name={field}
                        value={biography[field]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const { value } = e.target;
                            const parsedValue = type === 'number' ? parseInt(value) : value;
                            setBiography((previous) => ({
                                ...previous,
                                [field]: parsedValue
                            }));
                            onChange?.({
                                ...data,
                                biography: {
                                    ...data.biography,
                                    [field]: parsedValue
                                }
                            });
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Biography;
