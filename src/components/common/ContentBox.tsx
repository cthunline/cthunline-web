import { type PaperProps, Paper, Stack, Group, Title } from '@mantine/core';

interface ContentBoxProps {
    children?: React.ReactNode;
    w?: PaperProps['w'];
    maw?: PaperProps['maw'];
}

const ContentBox = ({ children, ...props }: ContentBoxProps) => (
    <Paper w="100%" maw="50rem" shadow="md" p="1rem" {...props}>
        <Stack align="center" w="100%">
            {children}
        </Stack>
    </Paper>
);

interface ContentBoxChildrenProps {
    children: React.ReactNode;
}

const ContentBoxTitle = ({ children }: ContentBoxChildrenProps) => (
    <Title order={6}>{children}</Title>
);

const ContentBoxContent = ({ children }: ContentBoxChildrenProps) => children;

const ContentBoxFooter = ({ children }: ContentBoxChildrenProps) => (
    <Group justify="center" w="100%">
        {children}
    </Group>
);

ContentBox.Title = ContentBoxTitle;
ContentBox.Content = ContentBoxContent;
ContentBox.Footer = ContentBoxFooter;

export default ContentBox;
