import { Card, type CardProps, Group, Text } from '@mantine/core';

type StatCardProps = CardProps & {
    label: string;
    value: string | number;
};

const StatCard = ({ label, value, ...props }: StatCardProps) => (
    <Card withBorder {...props}>
        <Group align="center" justify="space-between" gap="1rem">
            <Text fz="1.25rem">{label}</Text>
            <Text fz="2rem">{value}</Text>
        </Group>
    </Card>
);

export default StatCard;
