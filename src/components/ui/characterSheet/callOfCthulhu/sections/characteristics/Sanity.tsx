import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { useApp } from '../../../../../contexts/App';
import { onlyNumbers } from '../../../../../../services/tools';
import { CoCSanity } from '../../../../../../types/games/callOfCthulhu';
import { sanityKeys } from './characteristics.data';
import { controlSanity } from '../../cocSheet.helper';

interface SanityProps {
    data: CoCSanity;
    readonly: boolean;
    onChange: (data: CoCSanity) => void;
}

const Sanity: React.FC<SanityProps> = ({
    data,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" alignItems="center">
            <Box gridColumn="span 3">
                {T('game.callOfCthulhu.characteristic.sanity')}
            </Box>
            {sanityKeys.map(({ key, textKey, editable }) => (
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
                            onChange(
                                controlSanity({
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

export default memo(Sanity);
