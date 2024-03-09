import { memo } from 'react';
import { Box, Checkbox } from '@mui/material';
import { SWD6WoundStatus } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { WoundStatusField, woundStatusFields } from './woundStatus.data';

interface WoundStatusProps {
    woundStatus: SWD6WoundStatus;
    readonly: boolean;
    onChange: (data: SWD6WoundStatus) => void;
}

const WoundStatus = ({ woundStatus, readonly, onChange }: WoundStatusProps) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={1}
            alignItems="center"
        >
            {woundStatusFields.map(
                ({ keys, textKey }: WoundStatusField, index) => [
                    <Box
                        key={`woundStatus-${index.toString()}-label`}
                        gridColumn="span 7"
                    >
                        {T(`game.starWarsD6.woundStatus.${textKey}`)}
                    </Box>,
                    <Box
                        key={`woundStatus-${index.toString()}-input`}
                        gridColumn="span 5"
                    >
                        {keys.map((key) => (
                            <Checkbox
                                key={`woundStatus-checkbox-${key}`}
                                checked={woundStatus[key]}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (!readonly) {
                                        onChange({
                                            ...woundStatus,
                                            [key]: e.target.checked
                                        });
                                    }
                                }}
                            />
                        ))}
                    </Box>
                ]
            )}
        </Box>
    );
};

export default memo(WoundStatus);
