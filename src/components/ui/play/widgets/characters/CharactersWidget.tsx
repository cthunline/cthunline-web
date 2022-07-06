import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';

import { useApp } from '../../../../contexts/App';
import CharacterSheet from '../../../characterSheet/CharacterSheet';
import Widget from '../../Widget';
import { WidgetType, SessionUser } from '../../../../../types';

import './CharactersWidget.css';

interface CharacterWidgetProps {
    users: SessionUser[];
    onClose: (widget: WidgetType) => void;
}

const CharactersWidget: React.FC<CharacterWidgetProps> = ({
    users,
    onClose
}) => {
    const { T } = useApp();

    const [sessionUser, setSessionUser] = useState<SessionUser | null>(
        users[0] ?? null
    );

    const setTargetSessionUser = useCallback((userId: number) => {
        setSessionUser(
            users.find(({ id }) => id === userId) ?? null
        );
    }, [
        users
    ]);

    const onTabChange = (_e: React.SyntheticEvent, userId: number) => {
        setTargetSessionUser(userId);
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
    }, [
        users,
        sessionUser,
        setTargetSessionUser
    ]);

    return (
        <Widget
            id={`widget-${WidgetType.characters}`}
            title={T('entity.characters')}
            onClose={() => onClose(WidgetType.characters)}
        >
            <Box className="characters-widget flex row start">
                {users.length && sessionUser ? (
                    <Tabs
                        className="characters-widget-tabs"
                        orientation="vertical"
                        value={sessionUser.id}
                        onChange={onTabChange}
                    >
                        {users.map(({ id, name }) => (
                            <Tab
                                key={`characters-user-${id}`}
                                label={name}
                                value={id}
                            />
                        ))}
                    </Tabs>
                ) : null}
                {sessionUser ? (
                    <Box className="characters-widget-content flex grow start center full-height">
                        <CharacterSheet
                            readonly
                            gameId={sessionUser.character.gameId}
                            data={sessionUser.character.data}
                            listening
                            rawContent
                        />
                    </Box>
                ) : (
                    <Box className="flex grow center full-height">
                        <CircularProgress size={100} />
                    </Box>
                )}
            </Box>
        </Widget>
    );
};

export default CharactersWidget;
