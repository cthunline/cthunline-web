import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    CircularProgress
} from '@mui/material';

import { useDialog } from '../../contexts/Dialog';
import usePlay from '../../hooks/usePlay';
import PlayMenu from './PlayMenu';
import { WidgetType } from '../../../types';
import {
    Console,
    DicesWidget,
    CharacterWidget
} from '../../ui';

import './Play.css';

const Play = () => {
    const navigate = useNavigate();
    const { confirmDialog } = useDialog();
    const { sessionId, characterId } = useParams();
    const {
        socket,
        logs,
        requestDice
    } = usePlay({
        sessionId,
        characterId
    });

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
                            onClose={onWidgetClose}
                        />
                    );
                default:
                    return null;
            }
        })
    );

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

export default Play;
