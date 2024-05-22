import { Group, Stack, Text } from '@mantine/core';
import HarmPieSvg from '../../../../svg/games/apocalypseWorld/ApocalypseWorldHarmPie.js';

interface HarmPieProps {
    readonly?: boolean;
    value?: number;
    onChange?: (val: number) => void;
    onClear?: () => void;
    size?: string | number;
}

const HarmPie = ({
    readonly,
    value,
    onChange,
    onClear,
    size
}: HarmPieProps) => (
    <Stack align="center" justify="center" gap="0.5rem">
        <Text fz="0.875rem" lh="0.875rem">
            12
        </Text>
        <Group align="center" justify="center" gap="0.5rem">
            <Text fz="0.875rem" lh="0.875rem">
                9
            </Text>
            <HarmPieSvg
                readonly={readonly}
                activeValue={value}
                onSliceClick={onChange}
                onClear={onClear}
                width={size}
                height={size}
            />
            <Text fz="0.875rem" lh="0.875rem">
                3
            </Text>
        </Group>
        <Text fz="0.875rem" lh="0.875rem">
            6
        </Text>
    </Stack>
);

export default HarmPie;
