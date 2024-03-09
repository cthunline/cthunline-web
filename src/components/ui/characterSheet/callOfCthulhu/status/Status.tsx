import { memo } from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';
import { CoCStatus } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { fields } from './status.data';

interface StatusProps {
    status: CoCStatus;
    readonly: boolean;
    onChange: (data: CoCStatus) => void;
}

const Status = ({ readonly, status, onChange }: StatusProps) => {
    const { T } = useApp();

    return (
        <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={2}>
            {fields.map((key) => (
                <Box key={key} gridColumn="span 2">
                    <FormControlLabel
                        label={T(`game.callOfCthulhu.status.${key}`)}
                        labelPlacement="start"
                        control={
                            <Checkbox
                                checked={status[key]}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (!readonly) {
                                        onChange({
                                            ...status,
                                            [key]: e.target.checked
                                        });
                                    }
                                }}
                            />
                        }
                    />
                </Box>
            ))}
        </Box>
    );
};

export default memo(Status);
