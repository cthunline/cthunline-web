import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { useApp } from '../../contexts/App';
import { useDialog } from '../../contexts/Dialog';
import { PlayProvider, usePlay } from '../../contexts/Play';
import PlayMenu from './PlayMenu';
import { WidgetType } from '../../../types';
import { focusWidget } from '../../../services/widget';
import {
    Console,
    DicesWidget,
    CharacterWidget,
    CharactersWidget,
    JukeboxWidget,
    SketchWidget,
    NotesWidget,
    Audio,
    Sketch
} from '../../ui';

import './Play.css';

const PlayContent = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const { confirmDialog } = useDialog();
    const {
        characterId,
        socket,
        users,
        logs,
        requestDice,
        characterUpdate,
        playAudio,
        stopAudio,
        sketchData
    } = usePlay();

    const [openWidgets, setOpenWidgets] = useState<WidgetType[]>([]);

    const onWidgetOpen = (widget: WidgetType) => {
        if (!openWidgets.includes(widget)) {
            // if widget is not open then open it
            setOpenWidgets((previous) => [...previous, widget]);
        } else {
            // otherwise if it's already open focus it
            const widgetEl = document.querySelector(`#widget-${widget}`);
            if (widgetEl) {
                focusWidget(widgetEl as HTMLElement);
            }
        }
    };

    const onWidgetClose = (widget: WidgetType) => {
        setOpenWidgets((previous) =>
            previous.filter((openWidget) => openWidget !== widget)
        );
    };

    const onExit = () => {
        confirmDialog(T('page.play.exitConfirm'), () => {
            navigate('/sessions');
        });
    };

    const getWidgets = (widgs: WidgetType[]) =>
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
                            characterId={Number(characterId)}
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
                case WidgetType.jukebox:
                    return (
                        <JukeboxWidget
                            key={key}
                            onPlay={playAudio}
                            onStop={stopAudio}
                            onClose={onWidgetClose}
                        />
                    );
                case WidgetType.sketch:
                    return <SketchWidget key={key} onClose={onWidgetClose} />;
                case WidgetType.notes:
                    return <NotesWidget key={key} onClose={onWidgetClose} />;
                default:
                    return null;
            }
        });

    if (!socket) {
        return <CircularProgress size={100} />;
    }

    return (
        <Box className="play-container flex row full-width full-height">
            <PlayMenu
                isMaster={socket.isMaster}
                onWidgetOpen={onWidgetOpen}
                onExit={onExit}
            />
            <Box
                id="play-content"
                className="play-content grow flex column p-25"
            >
                {getWidgets(openWidgets)}
                {sketchData.displayed ? (
                    <Sketch isMaster={socket?.isMaster} />
                ) : null}
                {!socket.isMaster ? <Audio /> : null}
                <Console logs={logs} />
            </Box>
        </Box>
    );
};

const Play = () => {
    const { sessionId, characterId } = useParams();
    return sessionId ? (
        <PlayProvider
            sessionId={Number(sessionId)}
            characterId={Number(characterId)}
        >
            <PlayContent />
        </PlayProvider>
    ) : null;
};

export default Play;
