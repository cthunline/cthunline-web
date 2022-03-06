import React, { useState } from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { CoCPoint } from '../../../../../../types/games/callOfCthulhu';
import { pointsKeys } from './characteristics.data';
import { controlPoint } from './characteristics.helper';

interface PointProps {
    label: string;
    shortLabel?: string;
    data: CoCPoint;
    readonly: boolean;
    handleChange: (data: CoCPoint) => void;
}

const Point: React.FC<PointProps> = ({
    label,
    shortLabel,
    data,
    readonly,
    handleChange
}) => {
    const [point, setPoint] = useState<CoCPoint>(data);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
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
            {pointsKeys.map(({ key, label: keyLabel, editable }) => (
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
                        value={point[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setPoint((previous) => (
                                controlPoint({
                                    ...previous,
                                    [key]: Number(e.target.value)
                                })
                            ));
                            handleChange(
                                controlPoint({
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

export default Point;
