import { ActionIcon, Button, Chip, Table } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { GiRollingDices } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { modals } from '@mantine/modals';
import { HiPlus } from 'react-icons/hi';
import { useMemo } from 'react';

import useCharacter from '../../hooks/useCharacter.js';
import ContentBox from '../../common/ContentBox.js';
import useSession from '../../hooks/useSession.js';
import { toast } from '../../../services/toast.js';
import { useApp } from '../../contexts/App.js';
import useGame from '../../hooks/useGame.js';
import Select from '../../common/Select.js';
import SessionForm from './SessionForm.js';
import {
    type SelectOption,
    type Character,
    type SessionCreateBody
} from '../../../types/index.js';

interface CharacterSelectorProps {
    characters: Character[];
    onSelect: (charId: number) => void;
}

const CharacterSelector = ({
    characters,
    onSelect
}: CharacterSelectorProps) => {
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

const selectCharacterModalId = 'select-character-modal';
const createSessionModalId = 'create-session-modal';

const Sessions = () => {
    const { T, user } = useApp();
    const navigate = useNavigate();
    const { getGame } = useGame();
    const { characterList } = useCharacter({
        loadList: true
    });
    const { sessionList, deleteSession, createSession } = useSession({
        loadList: true
    });

    const onJoin = (
        gameId: string,
        sessionId: number,
        isMaster: boolean = false
    ) => {
        const charList = characterList.filter(
            ({ gameId: charGameId }) => charGameId === gameId
        );
        if (isMaster) {
            navigate(`/play/${sessionId}`);
        } else if (charList.length) {
            modals.open({
                modalId: selectCharacterModalId,
                centered: true,
                title: T('page.sessions.selectCharacter'),
                children: (
                    <CharacterSelector
                        characters={charList}
                        onSelect={(characterId) => {
                            modals.close(selectCharacterModalId);
                            navigate(`/play/${sessionId}/${characterId}`);
                        }}
                    />
                )
            });
        } else {
            toast.error(T('page.sessions.error.noCharacterAvailable'));
        }
    };

    const onSubmitSession = async (data: SessionCreateBody) => {
        await createSession({ data });
        modals.close(createSessionModalId);
    };

    const onCreateSession = () => {
        modals.open({
            modalId: createSessionModalId,
            centered: true,
            title: T('page.sessions.newSession'),
            children: <SessionForm onSubmit={onSubmitSession} />
        });
    };

    const onDeleteSession = (sessionId: number, name: string) => {
        const confirmText = T('page.sessions.deleteSessionConfirm', { name });
        modals.openConfirmModal({
            centered: true,
            title: confirmText,
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                deleteSession({
                    sessionId
                });
            }
        });
    };

    return (
        <ContentBox>
            <ContentBox.Title>{T('entity.sessions')}</ContentBox.Title>
            <ContentBox.Content>
                <Table stickyHeader>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th />
                            <Table.Th>{T('common.name')}</Table.Th>
                            <Table.Th>{T('entity.game')}</Table.Th>
                            <Table.Th>{T('entity.gameMaster')}</Table.Th>
                            <Table.Th />
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {sessionList.map(({ id, name, gameId, master }) => {
                            const isMaster = master?.id === user?.id;
                            return (
                                <Table.Tr key={`session-${id}`}>
                                    <Table.Td>
                                        <ActionIcon
                                            onClick={() =>
                                                onJoin(gameId, id, isMaster)
                                            }
                                        >
                                            <GiRollingDices />
                                        </ActionIcon>
                                    </Table.Td>
                                    <Table.Td>{name}</Table.Td>
                                    <Table.Td>{getGame(gameId)?.name}</Table.Td>
                                    <Table.Td>
                                        {master?.name}
                                        {isMaster ? (
                                            <>
                                                {' '}
                                                <Chip
                                                    size="xs"
                                                    display="inline-block"
                                                >
                                                    {T('common.itsYou')}
                                                </Chip>
                                            </>
                                        ) : null}
                                    </Table.Td>
                                    <Table.Td align="right">
                                        {isMaster ? (
                                            <ActionIcon
                                                color="red"
                                                onClick={() =>
                                                    onDeleteSession(id, name)
                                                }
                                            >
                                                <MdOutlineDeleteOutline />
                                            </ActionIcon>
                                        ) : null}
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </ContentBox.Content>
            <ContentBox.Footer>
                <Button leftSection={<HiPlus />} onClick={onCreateSession}>
                    {T('action.create')}
                </Button>
            </ContentBox.Footer>
        </ContentBox>
    );
};

export default Sessions;
