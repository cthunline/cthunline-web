import { FaFloppyDisk, FaRegCircleDot } from 'react-icons/fa6';
import { Tooltip, Box, Loader } from '@mantine/core';
import { useMemo } from 'react';

import { type CharacterSheetStatus } from '../../../types/index.js';
import { useApp } from '../../contexts/App.js';

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
                        <FaRegCircleDot
                            size="1.25rem"
                            color="var(--mantine-color-grey-filled)"
                        />
                    )
                },
                saving: {
                    text: T('status.saving'),
                    content: <Loader size="sm" color="orange" />
                },
                saved: {
                    text: T('status.saved'),
                    content: (
                        <FaFloppyDisk
                            size="1.25rem"
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
            <Box>{content}</Box>
        </Tooltip>
    );
};

export default Status;
