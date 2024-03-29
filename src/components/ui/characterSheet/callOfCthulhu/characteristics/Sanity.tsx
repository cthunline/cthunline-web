import { Box, TextField } from '@mui/material';
import { CoCSanity } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { sanityKeys } from './characteristics.data';
import { controlSanity } from '../cocSheet.helper';

interface SanityProps {
    data: CoCSanity;
    readonly: boolean;
    onChange: (data: CoCSanity) => void;
}

const Sanity = ({ data, readonly, onChange }: SanityProps) => {
    const { T } = useApp();

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 3">
                {T('game.callOfCthulhu.characteristic.sanity')}
            </Box>
            {sanityKeys.map(({ key, textKey, editable }) => (
                <Box key={key.toString()} gridColumn="span 3">
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly || !editable,
                            classes: {
                                input: 'input-smaller-text'
                            }
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

export default Sanity;
