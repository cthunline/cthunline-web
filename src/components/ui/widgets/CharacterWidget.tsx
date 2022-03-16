import React, {
    useState,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { Box, CircularProgress } from '@mui/material';
import { MdEdit, MdOutlineCheck } from 'react-icons/md';

import CharacterSheet from '../characterSheet/CharacterSheet';
import useCharacter from '../../hooks/useCharacter';
import Widget from '../play/Widget';
import {
    WidgetType,
    Character,
    CharacterData
} from '../../../types';

import './CharacterWidget.css';

interface CharacterWidgetProps {
    characterId: string;
    onUpdate: () => void;
    onClose: (widget: WidgetType) => void;
}

const CharacterWidget: React.FC<CharacterWidgetProps> = ({
    characterId,
    onUpdate,
    onClose
}) => {
    const { getCharacter, editCharacter } = useCharacter();

    const [readonly, setReadonly] = useState<boolean>(true);
    const [character, setCharacter] = useState<Character>();

    const onChange = useCallback((name: string, data: CharacterData) => {
        setCharacter((previous) => (
            previous ? {
                ...previous,
                name,
                data
            } : previous
        ));
    }, []);

    useEffect(() => {
        (async () => {
            if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [
        characterId,
        getCharacter
    ]);

    const changeTime = 1000;
    const changeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialRender = useRef(true);
    useEffect(() => {
        if (character) {
            if (initialRender.current) {
                initialRender.current = false;
            } else {
                if (changeTimer.current) {
                    clearTimeout(changeTimer.current);
                }
                changeTimer.current = setTimeout(async () => {
                    const { name, data } = character;
                    await editCharacter({
                        characterId: character.id,
                        data: {
                            name,
                            data
                        },
                        isToast: false,
                        isRefresh: false
                    });
                    onUpdate();
                }, changeTime);
            }
        }
    }, [
        character,
        editCharacter,
        onUpdate
    ]);

    const widgetActions = readonly ? (
        <MdEdit
            className="clickable"
            size={20}
            onClick={() => setReadonly(false)}
        />
    ) : (
        <MdOutlineCheck
            className="clickable"
            size={20}
            onClick={() => setReadonly(true)}
        />
    );

    return (
        <Widget
            title="Character"
            actions={widgetActions}
            onClose={() => onClose(WidgetType.character)}
        >
            <Box className="character-widget-content flex center">
                {character ? (
                    <CharacterSheet
                        readonly={readonly}
                        gameId={character.gameId}
                        data={character.data}
                        onChange={onChange}
                    />
                ) : (
                    <CircularProgress size={100} />
                )}
            </Box>
        </Widget>
    );
};

export default CharacterWidget;
