import { Box, Grid, Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { GiBookmarklet, GiWizardFace } from 'react-icons/gi';

import { gameIds } from '@cthunline/games';
import useStatistics from '../../../hooks/useStatistics.js';
import { useLocaleStore } from '../../../stores/locale.js';
import type { Statistics } from '../../../types/index.js';
import StatCard from '../../common/StatCard.js';
import GameLogo from '../../svg/games/GameLogo.js';

const statSpans: Record<keyof Statistics, number> = {
    runningSessions: 4,
    totalSessions: 4,
    playingUsers: 4,
    userCharacterCount: 6,
    totalCharacterCount: 6
};

const Home = () => {
    const T = useLocaleStore(({ T }) => T);

    const { statistics } = useStatistics();

    const statCardsData = useMemo(
        () =>
            Object.entries(statSpans).map(([key, span]) => ({
                key,
                label: T(`statistics.${key}`),
                value: statistics[key as keyof Statistics],
                span
            })),
        [T, statistics]
    );

    return (
        <Box w="100%" h="100%" flex="1" style={{ overflowY: 'auto' }}>
            <Stack
                w="100%"
                h="100%"
                align="center"
                justify="safe center"
                gap="2rem"
            >
                <Group align="center" justify="center" gap="2rem">
                    <GiWizardFace size={100} />
                    <Stack align="center" justify="center" gap="0.5rem">
                        <Title order={1}>{T('page.home.greetings')}</Title>
                        <Title order={2} fw="normal">
                            {T('page.home.welcome')}
                        </Title>
                    </Stack>
                </Group>
                <Grid gutter="1rem" maw="75rem">
                    {statCardsData.map(({ key, label, value, span }) => (
                        <Grid.Col span={span} key={`stats-card-${key}`}>
                            <StatCard label={label} value={value} />
                        </Grid.Col>
                    ))}
                </Grid>
                <Group align="center" justify="center" gap="2rem">
                    <GiBookmarklet size={75} />
                    <Stack align="center" justify="center" gap="0.5rem">
                        <Title order={2} fw="normal">
                            {T('page.home.availableGames')}
                        </Title>
                    </Stack>
                </Group>
                <Grid gutter="1rem" maw="75rem">
                    {gameIds.map((gameId) => (
                        <Grid.Col
                            span={4}
                            key={`game-logo-${gameId}`}
                            ta="center"
                        >
                            <GameLogo
                                gameId={gameId}
                                style={{
                                    maxWidth: '80%',
                                    maxHeight: '4rem',
                                    height: '4rem'
                                }}
                                fill="var(--palette-font)"
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
        </Box>
    );
};

export default Home;
