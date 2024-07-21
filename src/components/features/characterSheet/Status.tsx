import { Group, Loader, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { FaCircle } from 'react-icons/fa6';

import { useApp } from '../../../contexts/App.js';
import type { CharacterSheetStatus } from '../../../types/index.js';

interface CharacterSheetStatusData {
    text: string;
    content: React.ReactNode;
}

export interface StatusProps {
    status: CharacterSheetStatus;
}

const Status = ({ status }: StatusProps) => {
    const { T } = useApp();

    const statusData: Record<CharacterSheetStatus, CharacterSheetStatusData> =
        useMemo(
            () => ({
                idle: {
                    text: T('status.idle'),
                    content: (
                        <FaCircle
                            size="0.75rem"
                            color="var(--mantine-color-grey-filled)"
                        />
                    )
                },
                saving: {
                    text: T('status.saving'),
                    content: <Loader size="xs" color="orange" />
                },
                saved: {
                    text: T('status.saved'),
                    content: (
                        <FaCircle
                            size="0.75rem"
                            color="var(--mantine-color-green-filled)"
                        />
                    )
                }
            }),
            [T]
        );

    const { text, content } = statusData[status];

    return (
        <Tooltip label={text} position="bottom">
            <Group w="2rem" h="100%" align="center" justify="center">
                {content}
            </Group>
        </Tooltip>
    );
};

export default Status;
