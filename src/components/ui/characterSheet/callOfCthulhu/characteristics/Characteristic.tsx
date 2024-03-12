import { Box, TextField, Tooltip } from '@mui/material';
import { CoCCharacteristic } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { charKeys } from './characteristics.data';
import { controlCharacteristic } from '../cocSheet.helper';

interface CharacteristicProps {
    field: string;
    textKey?: string;
    data: CoCCharacteristic;
    readonly: boolean;
    onChange: (field: string, data: CoCCharacteristic) => void;
}

const Characteristic = ({
    field,
    textKey,
    data,
    readonly,
    onChange
}: CharacteristicProps) => {
    const { T, TU } = useApp();

    return (
        <Box
            gridColumn="span 6"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
        >
            <Box gridColumn="span 3">
                {textKey ? (
                    <Tooltip
                        title={T(`game.callOfCthulhu.characteristic.${field}`)}
                        placement="bottom"
                    >
                        <span>
                            {TU(`game.callOfCthulhu.characteristic.${textKey}`)}
                        </span>
                    </Tooltip>
                ) : (
                    T(`game.callOfCthulhu.characteristic.${field}`)
                )}
            </Box>
            {charKeys.map(({ key, textKey: subTextKey, editable }) => (
                <Box key={`characteristic-${key}`} gridColumn="span 3">
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
                        label={T(`game.callOfCthulhu.common.${subTextKey}`)}
                        value={data[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                field,
                                controlCharacteristic({
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

export default Characteristic;
