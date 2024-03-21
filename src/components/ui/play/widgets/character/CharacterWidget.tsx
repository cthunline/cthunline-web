import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { MdEdit, MdOutlineCheck } from 'react-icons/md';

import { WidgetType, Character, CharacterData } from '../../../../../types';
import CharacterSheet from '../../../characterSheet/CharacterSheet';
import useCharacter from '../../../../hooks/useCharacter';
import { deepEqual } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';
import Widget from '../../Widget';

import './CharacterWidget.css';

interface CharacterWidgetProps {
    characterId: number;
    onUpdate: () => void;
    onClose: (widget: WidgetType) => void;
}

const CharacterWidget = ({
    characterId,
    onUpdate,
    onClose
}: CharacterWidgetProps) => {
    const { T } = useApp();
    const { getCharacter, editCharacter, uploadPortrait, deletePortrait } =
        useCharacter();

    const [readonly, setReadonly] = useState<boolean>(true);
    const [character, setCharacter] = useState<Character>();

    const onChange = useCallback(
        (name: string, data: CharacterData) => {
            const checkData = {
                ...character,
                name,
                data
            };
            if (!deepEqual(checkData, character)) {
                setCharacter((previous) =>
                    previous
                        ? {
                              ...previous,
                              name,
                              data
                          }
                        : previous
                );
            }
        },
        [character]
    );

    const skipEdit = useRef(false);
    const onPortraitChange = useCallback(
        async (file: File | null) => {
            const options = {
                characterId,
                isToast: false,
                isRefresh: false
            };
            let updatedPortrait: string | null = null;
            if (file) {
                const { portrait } = await uploadPortrait({
                    ...options,
                    data: {
                        portrait: file
                    }
                });
                updatedPortrait = portrait;
            } else {
                await deletePortrait(options);
            }
            skipEdit.current = true;
            setCharacter((previous) =>
                previous
                    ? {
                          ...previous,
                          portrait: updatedPortrait
                      }
                    : previous
            );
        },
        [characterId, uploadPortrait, deletePortrait]
    );

    useEffect(() => {
        (async () => {
            if (characterId) {
                const char = await getCharacter(characterId);
                setCharacter(char);
            }
        })();
    }, [characterId, getCharacter]);

    const initialRender = useRef(true);
    useEffect(() => {
        if (character) {
            if (initialRender.current) {
                initialRender.current = false;
            } else if (skipEdit.current) {
                skipEdit.current = false;
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
    }, [character, editCharacter, onUpdate]);

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
            id={`widget-${WidgetType.character}`}
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
                        portrait={character.portrait}
                        onPortraitChange={onPortraitChange}
                    />
                ) : (
                    <CircularProgress size={100} />
                )}
            </Box>
        </Widget>
    );
};

export default CharacterWidget;
