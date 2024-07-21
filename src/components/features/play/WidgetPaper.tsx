import {
    ActionIcon,
    Box,
    Group,
    Paper,
    type PaperProps,
    Stack,
    type StackProps
} from '@mantine/core';
import { MdClose } from 'react-icons/md';

import { focusWidget } from '../../../services/widget.js';

interface WidgetPaperProps extends PaperProps {
    title: string;
    id: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    onClose?: () => void;
    contentProps?: StackProps;
}

const WidgetPaper = ({
    title,
    id,
    actions,
    children,
    onClose,
    contentProps,
    ...props
}: WidgetPaperProps) => (
    <Paper shadow="md" w="100%" miw="200px" h="100%" {...props}>
        <Stack w="100%" miw="200px" h="100%" gap={0}>
            <Group
                id={`${id}-bar`}
                justify="center"
                align="center"
                gap="0.5rem"
                w="100%"
                h="1.75rem"
                px="0.25rem"
                bg="var(--palette-background-tertiary)"
            >
                <Box px="0.25rem">{title}</Box>
                <Group flex={1} justify="end" gap="0.5rem">
                    {actions}
                </Group>
                {!!onClose && (
                    <ActionIcon variant="subtle" size="sm" onClick={onClose}>
                        <MdClose size="1.5rem" />
                    </ActionIcon>
                )}
            </Group>
            <Stack
                w="100%"
                h={0}
                flex={1}
                p="0.5rem"
                {...contentProps}
                onMouseDown={(e) => {
                    focusWidget(e.currentTarget);
                }}
            >
                {children}
            </Stack>
        </Stack>
    </Paper>
);

export default WidgetPaper;
