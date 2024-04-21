import { type CoCLuck } from '@cthunline/games';
import { Box, Group } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';
import { luckKeys } from './characteristics.data.js';

interface LuckProps {
    data: CoCLuck;
    readonly: boolean;
    onChange: (data: CoCLuck) => void;
}

const Luck = ({ data, readonly, onChange }: LuckProps) => {
    const { T } = useApp();

    return (
        <Group w="100%" gap="0.25rem">
            <Box flex="1 0">{T('game.callOfCthulhu.characteristic.luck')}</Box>
            {luckKeys.map(({ key, textKey, editable }) => (
                <Box flex="1 0" key={key.toString()}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly || !editable}
                        size="sm"
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
            <Box flex="1 0" />
        </Group>
    );
};

export default Luck;
