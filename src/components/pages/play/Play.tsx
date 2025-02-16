import { Group, Loader, Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useApp } from '../../../contexts/App.js';
import { AudioClientProvider } from '../../../contexts/AudioClient.js';
import { AudioMasterProvider } from '../../../contexts/AudioMaster.js';
import { PlayProvider, usePlay } from '../../../contexts/Play.js';
import { focusWidget } from '../../../services/widget.js';
import type { WidgetType, WidgetVisibility } from '../../../types/index.js';
import AudioClientVolume from '../../features/play/AudioClientVolume.js';
import Console from '../../features/play/Console.js';
import Sketch from '../../features/play/Sketch.js';
import CharacterWidget from '../../features/play/widgets/character/CharacterWidget.js';
import CharactersWidget from '../../features/play/widgets/characters/CharactersWidget.js';
import DicesWidget from '../../features/play/widgets/dices/DicesWidget.js';
import JukeboxWidget from '../../features/play/widgets/jukebox/JukeboxWidget.js';
import NotesWidget from '../../features/play/widgets/notes/NotesWidget.js';
import SketchWidget from '../../features/play/widgets/sketch/SketchWidget.js';
import PlayMenu from './PlayMenu.js';

const PlayContent = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const {
        characterId,
        socket,
        users,
        logs,
        requestDice,
        requestDiceAlien,
        characterUpdate,
        sketchData
    } = usePlay();

    const playContentRef = useRef<HTMLDivElement>(null);

    const [openWidgets, setOpenWidgets] = useState<WidgetType[]>([]);

    const [widgetsVisibility, setWidgetsVisibility] =
        useState<WidgetVisibility>('visible');

    const onWidgetOpen = (widget: WidgetType) => {
        if (openWidgets.includes(widget)) {
            // otherwise if it's already open focus it
            const widgetEl = document.querySelector(`#widget-${widget}`);
            if (widgetEl) {
                focusWidget(widgetEl as HTMLElement);
            }
        } else {
            // if widget is not open then open it
            setOpenWidgets((previous) => [...previous, widget]);
        }
    };

    const onWidgetClose = (widget: WidgetType) => {
        setOpenWidgets((previous) =>
            previous.filter((openWidget) => openWidget !== widget)
        );
    };

    const onWidgetsVisibilityChange = (visibility: WidgetVisibility) => {
        setWidgetsVisibility(visibility);
    };

    const onExit = () => {
        modals.openConfirmModal({
            centered: true,
            title: T('page.play.exitConfirm'),
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                navigate('/sessions');
            }
        });
    };

    const getWidgets = (widgs: WidgetType[]) =>
        widgs.map((widget) => {
            const key = `widget-${widget}`;
            switch (widget) {
                case 'dices':
                    return (
                        <DicesWidget
                            key={key}
                            isMaster={socket?.isMaster}
                            onRoll={requestDice}
                            onRollAlien={requestDiceAlien}
                            onClose={onWidgetClose}
                        />
                    );
                case 'character':
                    return (
                        <CharacterWidget
                            key={key}
                            characterId={Number(characterId)}
                            onUpdate={characterUpdate}
                            onClose={onWidgetClose}
                        />
                    );
                case 'characters':
                    return (
                        <CharactersWidget
                            key={key}
                            users={users.filter(({ isMaster }) => !isMaster)}
                            onClose={onWidgetClose}
                        />
                    );
                case 'jukebox':
                    return <JukeboxWidget key={key} onClose={onWidgetClose} />;
                case 'sketch':
                    return <SketchWidget key={key} onClose={onWidgetClose} />;
                case 'notes':
                    return <NotesWidget key={key} onClose={onWidgetClose} />;
                default:
                    return null;
            }
        });

    if (!socket) {
        return <Loader size="xl" />;
    }

    const content = (
        <Group
            w="100%"
            h="100%"
            gap={0}
            className={`widgets-visibility-${widgetsVisibility}`}
        >
            <PlayMenu
                isMaster={socket.isMaster}
                onWidgetOpen={onWidgetOpen}
                onWidgetsVisibilityChange={onWidgetsVisibilityChange}
                onExit={onExit}
            />
            <Stack
                ref={playContentRef}
                pos="relative"
                flex={1}
                p="1rem"
                h="100%"
            >
                {getWidgets(openWidgets)}
                {sketchData.displayed ? (
                    <Sketch isMaster={socket?.isMaster} />
                ) : null}
                {socket.isMaster ? null : <AudioClientVolume />}
                <Console logs={logs} playContentRef={playContentRef} />
            </Stack>
        </Group>
    );

    if (socket.isMaster) {
        return (
            <AudioMasterProvider socket={socket}>{content}</AudioMasterProvider>
        );
    }

    return <AudioClientProvider socket={socket}>{content}</AudioClientProvider>;
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
