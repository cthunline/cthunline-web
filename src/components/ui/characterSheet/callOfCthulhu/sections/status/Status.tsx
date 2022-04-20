import React, { memo } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';

import { useTranslation } from '../../../../../contexts/Translation';
import { CoCStatus } from '../../../../../../types/games/callOfCthulhu';
import { fields } from './status.data';

interface StatusProps {
    status: CoCStatus;
    readonly: boolean;
    onChange: (data: CoCStatus) => void;
}

const Status: React.FC<StatusProps> = ({
    readonly,
    status,
    onChange
}) => {
    const { T } = useTranslation();

    return (
        <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={2}>
            {fields.map((key) => (
                <Box key={key} gridColumn="span 2">
                    <FormControlLabel
                        label={T(`game.callOfCthulhu.status.${key}`)}
                        labelPlacement="start"
                        control={(
                            <Checkbox
                                checked={status[key]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (!readonly) {
                                        onChange({
                                            ...status,
                                            [key]: e.target.checked
                                        });
                                    }
                                }}
                            />
                        )}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default memo(Status);
