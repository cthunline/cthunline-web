import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    CircularProgress
} from '@mui/material';

import usePlay from '../../hooks/usePlay';
import PlayMenu from './PlayMenu';
import { Widget, Console } from '../../ui';
import { WidgetType } from '../../../types';

import './Play.css';

const Play = () => {
    const { sessionId, characterId } = useParams();
    const { socket, logs } = usePlay({
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

    return socket ? (
        <Box className="play-container flex row">
            <PlayMenu
                // isMaster={socket.isMaster}
                onWidgetOpen={onWidgetOpen}
            />
            <Box id="play-content" className="play-content flex column end">
                {openWidgets.map((widget) => (
                    <Widget
                        key={`widget-${widget}`}
                        onClose={() => onWidgetClose(widget)}
                    >
                        {widget}
                    </Widget>
                ))}
                <Console logs={logs} />
            </Box>
        </Box>
    ) : (
        <CircularProgress size={100} />
    );
};

export default Play;
