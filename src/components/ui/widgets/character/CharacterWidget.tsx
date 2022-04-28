import React, {
    useState,
    useCallback,
    useEffect,
    useRef
} from 'react';
import { Box, CircularProgress } from '@mui/material';
import { MdEdit, MdOutlineCheck } from 'react-icons/md';

import { useApp } from '../../../contexts/App';
import CharacterSheet from '../../characterSheet/CharacterSheet';
import useCharacter from '../../../hooks/useCharacter';
import Widget from '../../play/Widget';
import {
    WidgetType,
    Character,
    CharacterData
} from '../../../../types';

import './CharacterWidget.css';

interface CharacterWidgetProps {
    characterId: number;
    onUpdate: () => void;
    onClose: (widget: WidgetType) => void;
}

const CharacterWidget: React.FC<CharacterWidgetProps> = ({
    characterId,
    onUpdate,
    onClose
}) => {
    const { T } = useApp();
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

    const initialRender = useRef(true);
    useEffect(() => {
        if (character) {
            if (initialRender.current) {
                initialRender.current = false;
            } else {
                (async () => {
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
                })();
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
            id="widget-character"
            title={T('entity.character')}
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
