import { useState, useEffect, useCallback } from 'react';
import { Box, Group, Loader, Tabs } from '@mantine/core';

import { WidgetType, type SessionUser } from '../../../../../types';
import CharacterSheet from '../../../characterSheet/CharacterSheet';
import { useApp } from '../../../../contexts/App';
import Widget from '../../Widget';

interface CharacterWidgetProps {
    users: SessionUser[];
    onClose: (widget: WidgetType) => void;
}

const CharactersWidget = ({ users, onClose }: CharacterWidgetProps) => {
    const { T } = useApp();

    const [sessionUser, setSessionUser] = useState<SessionUser | null>(
        users[0] ?? null
    );

    const setTargetSessionUser = useCallback(
        (userId: number) => {
            setSessionUser(users.find(({ id }) => id === userId) ?? null);
        },
        [users]
    );

    const onTabChange = (userIdString: string | null) => {
        setTargetSessionUser(Number(userIdString));
    };

    useEffect(() => {
        if (users.length) {
            if (sessionUser) {
                setTargetSessionUser(sessionUser.id);
            } else {
                setSessionUser(users[0]);
            }
        } else {
            setSessionUser(null);
        }
    }, [users, sessionUser, setTargetSessionUser]);

    return (
        <Widget
            id={`widget-${WidgetType.characters}`}
            title={T('entity.characters')}
            onClose={() => onClose(WidgetType.characters)}
        >
            <Group
                className="characters-widget flex row start"
                w="900px"
                h="500px"
            >
                {users.length && sessionUser ? (
                    <Tabs
                        w="150px"
                        orientation="vertical"
                        value={sessionUser.id.toString()}
                        onChange={onTabChange}
                    >
                        <Tabs.List>
                            {users.map(({ id, name }) => (
                                <Tabs.Tab
                                    key={`characters-user-${id}`}
                                    value={id.toString()}
                                >
                                    {name}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs>
                ) : null}
                {sessionUser ? (
                    <Box flex={1} w="750px">
                        <CharacterSheet
                            readonly
                            gameId={sessionUser.character.gameId}
                            data={sessionUser.character.data}
                            portrait={sessionUser.character.portrait}
                            listening
                            rawContent
                        />
                    </Box>
                ) : (
                    <Group justify="center" flex={1}>
                        <Loader size="xl" />
                    </Group>
                )}
            </Group>
        </Widget>
    );
};

export default CharactersWidget;
