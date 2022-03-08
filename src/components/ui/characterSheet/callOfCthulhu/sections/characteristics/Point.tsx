import React, { memo } from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { onlyNumbers } from '../../../../../../services/tools';
import { CoCPoint } from '../../../../../../types/games/callOfCthulhu';
import { pointsKeys } from './characteristics.data';
import { controlPoint } from '../../cocSheet.helper';

interface PointProps {
    field: string;
    label: string;
    shortLabel?: string;
    data: CoCPoint;
    readonly: boolean;
    onChange: (field: string, data: CoCPoint) => void;
}

const Point: React.FC<PointProps> = ({
    field,
    label,
    shortLabel,
    data,
    readonly,
    onChange
}) => (
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
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(
                            field,
                            controlPoint({
                                ...data,
                                [key]: Number(onlyNumbers(e.target.value))
                            })
                        );
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Point);
