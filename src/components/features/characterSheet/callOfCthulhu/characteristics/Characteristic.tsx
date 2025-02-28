import type { CoCCharacteristic } from '@cthunline/games';
import { Box, Group, Tooltip } from '@mantine/core';
import { useShallow } from 'zustand/react/shallow';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import { controlCharacteristic } from '../cocSheet.helper.js';
import { charKeys } from './characteristics.data.js';

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
    const { T, TU } = useLocaleStore(useShallow(({ T, TU }) => ({ T, TU })));
    return (
        <Group w="100%" gap="0.25rem">
            <Box flex="1 0">
                {textKey ? (
                    <Tooltip
                        label={T(`game.callOfCthulhu.characteristic.${field}`)}
                        position="bottom"
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
                <Box flex="1 0" key={`characteristic-${key}`}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        size="sm"
                        readOnly={readonly || !editable}
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
        </Group>
    );
};

export default Characteristic;
