import {
    type StackProps,
    UnstyledButton,
    Group,
    Box,
    Stack
} from '@mantine/core';

import './InteractiveList.css';

interface InteractiveListProps extends Pick<StackProps, 'w'> {
    children?: React.ReactNode;
}

const InteractiveList = ({ children, ...props }: InteractiveListProps) => (
    <Stack gap={0} w="100%" {...props}>
        {children}
    </Stack>
);

interface InteractiveListItemProps {
    children?: React.ReactNode;
    onClick?: () => void;
    leftIcon?: React.ReactNode;
    rightAction?: React.ReactNode;
    selected?: boolean;
}

const InteractiveListItem = ({
    children,
    onClick,
    leftIcon,
    rightAction,
    selected
}: InteractiveListItemProps) => (
    <Group
        className={`interactive-list-item${selected ? ' interactive-list-item-selected' : ''}`}
        align="center"
        justify="center"
        gap={0}
        w="100%"
    >
        <UnstyledButton
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                flex: 1,
                padding: '0.5rem 0.75rem'
            }}
        >
            {leftIcon}
            <Box flex={1}>{children}</Box>
        </UnstyledButton>
        {!!rightAction && (
            <Group
                align="center"
                justify="center"
                gap="0.5rem"
                px="0.75rem"
                py="0.5rem"
            >
                {rightAction}
            </Group>
        )}
    </Group>
);

InteractiveList.Item = InteractiveListItem;

export default InteractiveList;
