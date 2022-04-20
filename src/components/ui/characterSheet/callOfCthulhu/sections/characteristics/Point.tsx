import React, { memo } from 'react';
import {
    Box,
    TextField,
    Tooltip
} from '@mui/material';

import { useTranslation } from '../../../../../contexts/Translation';
import { onlyNumbers } from '../../../../../../services/tools';
import { CoCPoint } from '../../../../../../types/games/callOfCthulhu';
import { pointsKeys } from './characteristics.data';
import { controlPoint } from '../../cocSheet.helper';

interface PointProps {
    field: string;
    textKey?: string;
    data: CoCPoint;
    readonly: boolean;
    onChange: (field: string, data: CoCPoint) => void;
}

const Point: React.FC<PointProps> = ({
    field,
    textKey,
    data,
    readonly,
    onChange
}) => {
    const { T, TU } = useTranslation();

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" alignItems="center">
            <Box gridColumn="span 3">
                {textKey ? (
                    <Tooltip title={T(`game.callOfCthulhu.characteristic.${field}`)} placement="bottom">
                        <span>{TU(`game.callOfCthulhu.characteristic.${textKey}`)}</span>
                    </Tooltip>
                ) : T(`game.callOfCthulhu.characteristic.${field}`)}
            </Box>
            {pointsKeys.map(({ key, textKey: subTextKey, editable }) => (
                <Box key={key.toString()} gridColumn="span 3">
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={T(`game.callOfCthulhu.common.${subTextKey}`)}
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
};

export default memo(Point);
