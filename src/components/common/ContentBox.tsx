import { type PaperProps, Paper, Stack, Group, Title } from '@mantine/core';

interface ContentBoxProps {
    children?: React.ReactNode;
    w?: PaperProps['w'];
    maw?: PaperProps['maw'];
    miw?: PaperProps['miw'];
    h?: PaperProps['h'];
    mah?: PaperProps['mah'];
    mih?: PaperProps['mih'];
}

const ContentBox = ({ children, ...props }: ContentBoxProps) => (
    <Paper w="100%" maw="50rem" mah="100%" shadow="md" p="1rem" {...props}>
        <Stack align="center" w="100%" h="100%">
            {children}
        </Stack>
    </Paper>
);

interface ContentBoxChildrenProps {
    children: React.ReactNode;
}

const ContentBoxTitle = ({ children }: ContentBoxChildrenProps) => (
    <Title order={6} w="100%" ta="center">
        {children}
    </Title>
);

const ContentBoxContent = ({ children }: ContentBoxChildrenProps) => (
    <Stack w="100%" flex={1} h={0} style={{ overflowY: 'auto' }}>
        {children}
    </Stack>
);

const ContentBoxFooter = ({ children }: ContentBoxChildrenProps) => (
    <Group justify="center" w="100%">
        {children}
    </Group>
);

ContentBox.Title = ContentBoxTitle;
ContentBox.Content = ContentBoxContent;
ContentBox.Footer = ContentBoxFooter;

export default ContentBox;
