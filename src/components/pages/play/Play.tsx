import { useParams, useNavigate } from 'react-router-dom';
import { Group, Loader, Stack } from '@mantine/core';
import { useRef, useState } from 'react';
import { modals } from '@mantine/modals';

import CharactersWidget from '../../features/play/widgets/characters/CharactersWidget';
import CharacterWidget from '../../features/play/widgets/character/CharacterWidget';
import JukeboxWidget from '../../features/play/widgets/jukebox/JukeboxWidget';
import SketchWidget from '../../features/play/widgets/sketch/SketchWidget';
import NotesWidget from '../../features/play/widgets/notes/NotesWidget';
import DicesWidget from '../../features/play/widgets/dices/DicesWidget';
import { PlayProvider, usePlay } from '../../contexts/Play';
import { focusWidget } from '../../../services/widget';
import Console from '../../features/play/Console';
import Sketch from '../../features/play/Sketch';
import Audio from '../../features/play/Audio';
import { useApp } from '../../contexts/App';
import { WidgetType } from '../../../types';
import PlayMenu from './PlayMenu';

const PlayContent = () => {
    const { T } = useApp();
    const navigate = useNavigate();
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

    const playContentRef = useRef<HTMLDivElement>(null);

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
        return <Loader size="xl" />;
    }

    return (
        <Group w="100%" h="100%">
            <PlayMenu
                isMaster={socket.isMaster}
                onWidgetOpen={onWidgetOpen}
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
                {!socket.isMaster ? <Audio /> : null}
                <Console logs={logs} playContentRef={playContentRef} />
            </Stack>
        </Group>
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
