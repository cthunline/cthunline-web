import React from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';

import { CoCStatus, CoCCharacterData } from '../../../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../../../characterSheetProps';
import { fields } from './status.data';

const Status: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => {
    const handleChange = (field: keyof CoCStatus, checked: boolean) => {
        onChange?.({
            ...data,
            status: {
                ...data.status,
                [field]: checked
            }
        });
    };

    return (
        <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={2}>
            {fields.map(({ field, label }) => (
                <Box key={field} gridColumn="span 2">
                    <FormControlLabel
                        label={label}
                        labelPlacement="start"
                        control={(
                            <Checkbox
                                disabled={readonly}
                                checked={data.status[field]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    handleChange(field, e.target.checked);
                                }}
                            />
                        )}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Status;
