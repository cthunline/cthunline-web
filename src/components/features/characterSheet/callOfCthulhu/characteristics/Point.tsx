import type { CoCPoint } from '@cthunline/games';
import { Box, Group, Tooltip } from '@mantine/core';
import { useShallow } from 'zustand/react/shallow';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import { controlPoint } from '../cocSheet.helper.js';
import { pointsKeys } from './characteristics.data.js';

interface PointProps {
    field: string;
    textKey?: string;
    data: CoCPoint;
    readonly: boolean;
    onChange: (field: string, data: CoCPoint) => void;
}

const Point = ({ field, textKey, data, readonly, onChange }: PointProps) => {
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
            {pointsKeys.map(({ key, textKey: subTextKey, editable }) => (
                <Box flex="1 0" key={key.toString()}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly || !editable}
                        size="sm"
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
            <Box flex="1 0" />
        </Group>
    );
};

export default Point;
