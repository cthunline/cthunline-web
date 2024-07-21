import {
    BackgroundImage,
    Group,
    Paper,
    Stack,
    type StackProps,
    Text,
    UnstyledButton
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaRegUser } from 'react-icons/fa6';

import { getAssetUrl } from '../../../services/api.js';
import type { SessionUser } from '../../../types/index.js';

interface CharacterModalProps {
    player: SessionUser;
}

const CharacterModal = ({ player }: CharacterModalProps) => {
    const {
        name,
        character: { name: characterName, portrait }
    } = player;
    return (
        <Stack align="start">
            <Text fz="0.875rem" fs="italic">
                {name}
            </Text>
            {!!portrait && (
                <Group w="100%" justify="center">
                    <img
                        src={getAssetUrl(portrait)}
                        alt={characterName}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '20rem'
                        }}
                    />
                </Group>
            )}
        </Stack>
    );
};

interface CharacterPortraitsProps extends StackProps {
    players: SessionUser[];
}

const CharacterPortraits = ({ players, ...props }: CharacterPortraitsProps) => {
    const onPortraitClick = (player: SessionUser) => {
        modals.open({
            // modalId: saveSketchModalId,
            centered: true,
            title: player.character.name,
            children: <CharacterModal player={player} />
        });
    };

    return (
        <Stack w="5rem" h="100%" justify="start" gap="0.5rem" {...props}>
            {!!players.length &&
                players.map((player) => {
                    const {
                        character: { id, portrait }
                    } = player;
                    return (
                        <Paper
                            key={`character-portrait-${id}`}
                            shadow="sm"
                            w="100%"
                            h="6rem"
                            p="0.5rem"
                        >
                            <UnstyledButton
                                w="100%"
                                h="100%"
                                onClick={() => onPortraitClick(player)}
                            >
                                {portrait ? (
                                    <BackgroundImage
                                        src={getAssetUrl(portrait)}
                                        w="100%"
                                        h="100%"
                                    />
                                ) : (
                                    <Stack
                                        align="center"
                                        justify="center"
                                        w="100%"
                                        h="100%"
                                    >
                                        <FaRegUser
                                            size="3.5rem"
                                            opacity={0.25}
                                        />
                                    </Stack>
                                )}
                            </UnstyledButton>
                        </Paper>
                    );
                })}
        </Stack>
    );
};

export default CharacterPortraits;
