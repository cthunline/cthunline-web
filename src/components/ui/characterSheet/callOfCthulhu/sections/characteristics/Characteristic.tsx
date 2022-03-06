import React, { useState } from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { CoCCharacteristic } from '../../../../../../types/games/callOfCthulhu';
import { charKeys } from './characteristics.data';
import { controlCharacteristic } from './characteristics.helper';

interface CharacteristicProps {
    label: string;
    shortLabel?: string;
    data: CoCCharacteristic;
    readonly: boolean;
    handleChange: (data: CoCCharacteristic) => void;
}

const Characteristic: React.FC<CharacteristicProps> = ({
    label,
    shortLabel,
    data,
    readonly,
    handleChange
}) => {
    const [characteristic, setCharacteristic] = useState<CoCCharacteristic>(data);

    return (
        <Box gridColumn="span 6" display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box
                gridColumn="span 3"
                display="grid"
                alignItems="center"
            >
                {shortLabel ? (
                    <Tooltip title={label} placement="bottom">
                        <span>{shortLabel}</span>
                    </Tooltip>
                ) : label}
            </Box>
            {charKeys.map(({ key, label: keyLabel, editable }) => (
                <Box
                    key={key.toString()}
                    gridColumn="span 3"
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={keyLabel}
                        value={characteristic[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCharacteristic((previous) => (
                                controlCharacteristic({
                                    ...previous,
                                    [key]: Number(e.target.value)
                                })
                            ));
                            handleChange(
                                controlCharacteristic({
                                    ...data,
                                    [key]: Number(e.target.value)
                                })
                            );
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Characteristic;
