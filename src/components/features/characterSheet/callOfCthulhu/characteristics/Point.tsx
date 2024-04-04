import { Box, Group, Tooltip } from '@mantine/core';
import { type CoCPoint } from '@cthunline/games';

import { onlyNumbers } from '../../../../../services/tools';
import TextInput from '../../../../common/TextInput';
import { pointsKeys } from './characteristics.data';
import { useApp } from '../../../../contexts/App';
import { controlPoint } from '../cocSheet.helper';

interface PointProps {
    field: string;
    textKey?: string;
    data: CoCPoint;
    readonly: boolean;
    onChange: (field: string, data: CoCPoint) => void;
}

const Point = ({ field, textKey, data, readonly, onChange }: PointProps) => {
    const { T, TU } = useApp();

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
