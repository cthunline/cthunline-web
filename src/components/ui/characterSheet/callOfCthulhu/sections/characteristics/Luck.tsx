import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { useTranslation } from '../../../../../contexts/Translation';
import { onlyNumbers } from '../../../../../../services/tools';
import { CoCLuck } from '../../../../../../types/games/callOfCthulhu';
import { luckKeys } from './characteristics.data';

interface LuckProps {
    data: CoCLuck;
    readonly: boolean;
    onChange: (data: CoCLuck) => void;
}

const Luck: React.FC<LuckProps> = ({
    data,
    readonly,
    onChange
}) => {
    const { T } = useTranslation();

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" alignItems="center">
            <Box gridColumn="span 3" alignItems="center">
                {T('game.callOfCthulhu.characteristic.luck')}
            </Box>
            {luckKeys.map(({ key, textKey, editable }) => (
                <Box key={key.toString()} gridColumn="span 3">
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={T(`game.callOfCthulhu.common.${textKey}`)}
                        value={data[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange({
                                ...data,
                                [key]: Number(onlyNumbers(e.target.value))
                            });
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default memo(Luck);
