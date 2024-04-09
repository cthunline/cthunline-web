import { useState, useCallback, useEffect, useRef } from 'react';
import { MdEdit, MdOutlineCheck } from 'react-icons/md';
import { ActionIcon, Box, Loader } from '@mantine/core';

import CharacterSheet from '../../../characterSheet/CharacterSheet.js';
import useCharacter from '../../../../hooks/useCharacter.js';
import { deepEqual } from '../../../../../services/tools.js';
import { useApp } from '../../../../contexts/App.js';
import Widget from '../../Widget.js';
import {
    WidgetType,
    type Character,
    type CharacterData
} from '../../../../../types/index.js';

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
        <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => setReadonly(false)}
        >
            <MdEdit size="1rem" />
        </ActionIcon>
    ) : (
        <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => setReadonly(true)}
        >
            <MdOutlineCheck size="1rem" />
        </ActionIcon>
    );

    return (
        <Widget
            id={`widget-${WidgetType.character}`}
            title={T('entity.character')}
            actions={widgetActions}
            onClose={() => onClose(WidgetType.character)}
        >
            <Box w="750px" h="500px">
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
                    <Loader size="xl" />
                )}
            </Box>
        </Widget>
    );
};

export default CharacterWidget;
