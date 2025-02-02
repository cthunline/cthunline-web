import { Box, Group, Stack, Tabs } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { FaUsers } from 'react-icons/fa6';

import { useApp } from '../../../../../contexts/App.js';
import type { SessionUser, WidgetType } from '../../../../../types/index.js';
import CharacterSheet from '../../../characterSheet/CharacterSheet.js';
import Widget from '../../Widget.js';

interface CharacterWidgetProps {
    users: SessionUser[];
    onClose: (widget: WidgetType) => void;
}

const CharactersWidget = ({ users, onClose }: CharacterWidgetProps) => {
    const { T } = useApp();

    const [sessionUser, setSessionUser] = useState<SessionUser | null>(
        users[0] ?? null
    );

    const usersById = useMemo(
        () =>
            new Map<number, SessionUser>(users.map((user) => [user.id, user])),
        [users]
    );

    const onTabChange = (userIdString: string | null) => {
        const user = usersById.get(Number(userIdString));
        if (user) {
            setSessionUser(user);
        }
    };

    useEffect(() => {
        const currentChar = sessionUser?.id
            ? usersById.get(sessionUser.id)
            : undefined;
        if (currentChar) {
            setSessionUser(currentChar);
        } else if (usersById.size && !currentChar) {
            const [[, firstUser]] = usersById;
            setSessionUser(firstUser);
        } else {
            setSessionUser(null);
        }
    }, [sessionUser, usersById]);

    return (
        <Widget
            id="widget-characters"
            title={T('entity.characters')}
            onClose={() => onClose('characters')}
        >
            <Group
                className="characters-widget"
                w="900px"
                h="500px"
                align="start"
            >
                {users.length && sessionUser ? (
                    <>
                        <Tabs
                            w="150px"
                            orientation="vertical"
                            value={sessionUser.id.toString()}
                            onChange={onTabChange}
                        >
                            <Tabs.List w="100%">
                                {users.map(({ id, name, character }) => (
                                    <Tabs.Tab
                                        key={`characters-user-${id}`}
                                        value={id.toString()}
                                        w="100%"
                                    >
                                        <Stack gap="0.25rem">
                                            <Box
                                                style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {character.name}
                                            </Box>
                                            <Box
                                                style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                <i>({name})</i>
                                            </Box>
                                        </Stack>
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs>
                        <Box flex={1} w="750px" h="100%">
                            <CharacterSheet
                                readonly
                                gameId={sessionUser.character.gameId}
                                data={sessionUser.character.data}
                                portrait={sessionUser.character.portrait}
                                listening
                                rawContent
                            />
                        </Box>
                    </>
                ) : (
                    <Stack
                        w="100%"
                        h="100%"
                        align="center"
                        justify="center"
                        gap="1rem"
                    >
                        {T('widget.characters.empty')}
                        <FaUsers size="2rem" />
                    </Stack>
                )}
            </Group>
        </Widget>
    );
};

export default CharactersWidget;
