import { Group, Stack, Text } from '@mantine/core';
import { useConfigurationStore } from '../../../stores/configuration.js';

const About = () => {
    const apiVersion = useConfigurationStore(({ apiVersion }) => apiVersion);
    return (
        <Stack gap="0.25rem" p="0.5rem" align="center" justify="center">
            <Group gap="1rem">
                <Text fw="bold">API</Text>
                <Text>v{apiVersion}</Text>
            </Group>
            <Group gap="1rem">
                <Text fw="bold">Web</Text>
                <Text>v{import.meta.env.VITE_WEB_VERSION}</Text>
            </Group>
        </Stack>
    );
};

export default About;
