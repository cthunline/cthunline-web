import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';

import { useApp } from '../../../contexts/App';
import CharacterSheet from '../../characterSheet/CharacterSheet';
import Widget from '../../play/Widget';
import { WidgetType, SessionUser } from '../../../../types';

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

    const onTabChange = (e: React.SyntheticEvent, userId: number) => {
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
            id="widget-characters"
            title={T('entity.characters')}
            onClose={() => onClose(WidgetType.characters)}
        >
            <Box className="characters-widget-content flex column center">
                {users.length && sessionUser ? (
                    <Tabs
                        className="characters-widget-tabs full-width"
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
                    <CharacterSheet
                        readonly
                        gameId={sessionUser.character.gameId}
                        data={sessionUser.character.data}
                        listening
                    />
                ) : (
                    <Box className="grow flex center">
                        <CircularProgress size={100} />
                    </Box>
                )}
            </Box>
        </Widget>
    );
};

export default CharactersWidget;
