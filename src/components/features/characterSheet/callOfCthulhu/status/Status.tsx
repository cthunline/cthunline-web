import type { CoCStatus } from '@cthunline/games';
import { Box, Checkbox, Group } from '@mantine/core';

import { useLocaleStore } from '../../../../../stores/locale.js';
import { fields } from './status.data.js';

interface StatusProps {
    status: CoCStatus;
    readonly: boolean;
    onChange: (data: CoCStatus) => void;
}

const Status = ({ readonly, status, onChange }: StatusProps) => {
    const T = useLocaleStore(({ T }) => T);

    return (
        <Group w="100%" gap="1rem">
            {fields.map((key) => (
                <Box key={key} flex="1 0">
                    <Checkbox
                        label={T(`game.callOfCthulhu.status.${key}`)}
                        labelPosition="left"
                        checked={status[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!readonly) {
                                onChange({
                                    ...status,
                                    [key]: e.target.checked
                                });
                            }
                        }}
                    />
                </Box>
            ))}
        </Group>
    );
};

export default Status;
