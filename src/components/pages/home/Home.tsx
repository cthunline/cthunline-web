import { Box, Grid, Group, Stack, Title } from '@mantine/core';
import { useMemo } from 'react';
import { GiBookmarklet, GiWizardFace } from 'react-icons/gi';

import { useApp } from '../../../contexts/App.js';
import useStatistics from '../../../hooks/useStatistics.js';
import { GameId, type Statistics } from '../../../types/index.js';
import StatCard from '../../common/StatCard.js';
import ApocalypseWorld from '../../svg/games/apocalypseWorld/ApocalypseWorldLogo.js';
import CallOfCthulhu from '../../svg/games/callOfCthulhu/CallOfCthulhuLogo.js';
import DnD5 from '../../svg/games/dnd5/DnD5Logo.js';
import SeventhSea from '../../svg/games/seventhSea/SeventhSeaLogo.js';
import StarWarsD6 from '../../svg/games/starWarsD6/StarWarsD6Logo.js';
import WarhammerFantasy from '../../svg/games/warhammerFantasy/WarhammerFantasyLogo.js';

const statSpans: Record<keyof Statistics, number> = {
    runningSessions: 4,
    totalSessions: 4,
    playingUsers: 4,
    userCharacterCount: 6,
    totalCharacterCount: 6
};

const gameData: {
    gameId: GameId;
    Logo: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
    span: number;
}[] = [
    { gameId: GameId.apocalypseWorld, Logo: ApocalypseWorld, span: 4 },
    { gameId: GameId.callOfCthulhu, Logo: CallOfCthulhu, span: 4 },
    { gameId: GameId.dnd5, Logo: DnD5, span: 4 },
    { gameId: GameId.seventhSea, Logo: SeventhSea, span: 4 },
    { gameId: GameId.starWarsD6, Logo: StarWarsD6, span: 4 },
    { gameId: GameId.warhammerFantasy, Logo: WarhammerFantasy, span: 4 }
];

const Home = () => {
    const { T } = useApp();
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
                    {gameData.map(({ gameId, Logo, span }) => (
                        <Grid.Col span={span} key={`game-logo-${gameId}`}>
                            <Logo
                                style={{ maxWidth: '80%', maxHeight: '4rem' }}
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
