import type { SWD6WoundStatus } from '@cthunline/games';
import { Box, Checkbox, Group, Stack } from '@mantine/core';

import { useLocaleStore } from '../../../../../stores/locale.js';
import {
    type WoundStatusField,
    woundStatusFields
} from './woundStatus.data.js';

interface WoundStatusProps {
    woundStatus: SWD6WoundStatus;
    readonly: boolean;
    onChange: (data: SWD6WoundStatus) => void;
}

const WoundStatus = ({ woundStatus, readonly, onChange }: WoundStatusProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack w="100%">
            {woundStatusFields.map(
                ({ keys, textKey }: WoundStatusField, index) => [
                    <Group w="100%" key={`woundStatus-${index.toString()}`}>
                        <Box flex="2 0">
                            {T(`game.starWarsD6.woundStatus.${textKey}`)}
                        </Box>
                        <Group flex="1 0">
                            {keys.map((key) => (
                                <Checkbox
                                    key={`woundStatus-checkbox-${key}`}
                                    checked={woundStatus[key]}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        if (!readonly) {
                                            onChange({
                                                ...woundStatus,
                                                [key]: e.target.checked
                                            });
                                        }
                                    }}
                                />
                            ))}
                        </Group>
                    </Group>
                ]
            )}
        </Stack>
    );
};

export default WoundStatus;
