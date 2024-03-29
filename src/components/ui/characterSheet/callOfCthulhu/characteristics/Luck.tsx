import { Box, TextField } from '@mui/material';
import { CoCLuck } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { luckKeys } from './characteristics.data';

interface LuckProps {
    data: CoCLuck;
    readonly: boolean;
    onChange: (data: CoCLuck) => void;
}

const Luck = ({ data, readonly, onChange }: LuckProps) => {
    const { T } = useApp();

    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 3" alignItems="center">
                {T('game.callOfCthulhu.characteristic.luck')}
            </Box>
            {luckKeys.map(({ key, textKey, editable }) => (
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

export default Luck;
