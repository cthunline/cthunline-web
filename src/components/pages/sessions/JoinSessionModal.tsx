import type { GameId } from '@cthunline/games';
import { Alert, Button, InputLabel, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { FaInfo } from 'react-icons/fa6';
import { HiPlus } from 'react-icons/hi';

import { useLocaleStore } from '../../../stores/locale.js';
import type { Character, SelectOption } from '../../../types/index.js';
import Select from '../../common/Select.js';

interface CharacterSelectProps {
    characters: Character[];
    onSelect: (charId: number) => void;
}

const CharacterSelect = ({ characters, onSelect }: CharacterSelectProps) => {
    const T = useLocaleStore(({ T }) => T);

    const options: SelectOption<number>[] = useMemo(
        () =>
            characters.map(({ id, name }) => ({
                value: id,
                label: name
            })),
        [characters]
    );

    return (
        <Select
            label={T('page.sessions.selectCharacter')}
            valueType="number"
            options={options}
            onChange={(characterId: number | null) => {
                if (characterId) {
                    onSelect(characterId);
                }
            }}
        />
    );
};

interface JoinSessionModalProps {
    gameId: GameId;
    characters: Character[];
    onSelect: (charId: number) => void;
    onCreate: () => void;
}

const JoinSessionModal = ({
    gameId,
    characters,
    onSelect,
    onCreate
}: JoinSessionModalProps) => {
    const t = useLocaleStore(({ t }) => t);
    const T = useLocaleStore(({ T }) => T);

    const gameCharacters = useMemo(
        () =>
            characters.filter(
                ({ gameId: charGameId }) => charGameId === gameId
            ),
        [characters, gameId]
    );

    const availableCharacters = !!gameCharacters.length;

    return (
        <Stack gap="1rem">
            {availableCharacters ? (
                <CharacterSelect
                    characters={gameCharacters}
                    onSelect={onSelect}
                />
            ) : (
                <Alert
                    w="100%"
                    variant="default"
                    color="gray"
                    title={T('page.sessions.noCharacterAvailable')}
                    icon={<FaInfo />}
                />
            )}
            <Stack gap="0.25rem">
                {availableCharacters && (
                    <InputLabel>
                        {t('page.sessions.orCreateCharacter')}
                    </InputLabel>
                )}
                <Button leftSection={<HiPlus />} onClick={onCreate}>
                    {T('action.createAndJoin')}
                </Button>
            </Stack>
        </Stack>
    );
};

export default JoinSessionModal;
