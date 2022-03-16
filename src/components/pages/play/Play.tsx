import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    CircularProgress
} from '@mui/material';

import { useDialog } from '../../contexts/Dialog';
import { PlayProvider, usePlay } from '../../contexts/Play';
import PlayMenu from './PlayMenu';
import { WidgetType } from '../../../types';
import {
    Console,
    DicesWidget,
    CharacterWidget,
    CharactersWidget
} from '../../ui';

import './Play.css';

const Play = () => {
    const navigate = useNavigate();
    const { confirmDialog } = useDialog();
    const {
        characterId,
        socket,
        users,
        disconnectSocket,
        logs,
        requestDice,
        characterUpdate
    } = usePlay();

    const [openWidgets, setOpenWidgets] = useState<WidgetType[]>([]);

    const onWidgetOpen = (widget: WidgetType) => {
        if (!openWidgets.includes(widget)) {
            setOpenWidgets((previous) => ([
                ...previous,
                widget
            ]));
        }
    };

    const onWidgetClose = (widget: WidgetType) => {
        setOpenWidgets((previous) => (
            previous.filter((openWidget) => (
                openWidget !== widget
            ))
        ));
    };

    const onExit = () => {
        confirmDialog('Exit session ?', () => {
            navigate('/sessions');
        });
    };

    const getWidgets = (widgs: WidgetType[]) => (
        widgs.map((widget) => {
            const key = `widget-${widget}`;
            switch (widget) {
                case WidgetType.dices:
                    return (
                        <DicesWidget
                            key={key}
                            isMaster={socket?.isMaster}
                            onRoll={requestDice}
                            onClose={onWidgetClose}
                        />
                    );
                case WidgetType.character:
                    return (
                        <CharacterWidget
                            key={key}
                            characterId={characterId ?? ''}
                            onUpdate={characterUpdate}
                            onClose={onWidgetClose}
                        />
                    );
                case WidgetType.characters:
                    return (
                        <CharactersWidget
                            key={key}
                            users={users.filter(({ isMaster }) => !isMaster)}
                            onClose={onWidgetClose}
                        />
                    );
                default:
                    return null;
            }
        })
    );

    useEffect(() => (
        () => disconnectSocket()
    ), [
        disconnectSocket
    ]);

    return socket ? (
        <Box className="play-container flex row">
            <PlayMenu
                isMaster={socket.isMaster}
                onWidgetOpen={onWidgetOpen}
                onExit={onExit}
            />
            <Box id="play-content" className="play-content flex column end">
                {getWidgets(openWidgets)}
                <Console logs={logs} />
            </Box>
        </Box>
    ) : (
        <CircularProgress size={100} />
    );
};

const PlayWrapper = () => {
    const { sessionId, characterId } = useParams();
    return sessionId ? (
        <PlayProvider
            sessionId={sessionId}
            characterId={characterId}
        >
            <Play />
        </PlayProvider>
    ) : null;
};

export default PlayWrapper;
