import { type GameId, getGame, isGameId } from '@cthunline/games';
import { ActionIcon, Alert, Button, Chip, Table } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaInfo } from 'react-icons/fa6';
import { GiRollingDices } from 'react-icons/gi';
import { HiPlus } from 'react-icons/hi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router';

import useCharacter from '../../../hooks/api/useCharacter.js';
import useSession from '../../../hooks/api/useSession.js';
import { useAuthStore } from '../../../stores/auth.js';
import { useLocaleStore } from '../../../stores/locale.js';
import type { SessionCreateBody } from '../../../types/index.js';
import ContentBox from '../../common/ContentBox.js';
import JoinSessionModal from './JoinSessionModal.js';
import SessionForm from './SessionForm.js';

const selectCharacterModalId = 'select-character-modal';
const createSessionModalId = 'create-session-modal';

const Sessions = () => {
    const T = useLocaleStore(({ T }) => T);
    const user = useAuthStore(({ user }) => user);

    const navigate = useNavigate();
    const { characterList, createCharacter } = useCharacter({
        loadList: true
    });
    const { sessionList, deleteSession, createSession } = useSession({
        loadList: true
    });

    const joinSession = (sessionId: number, characterId: number) => {
        modals.close(selectCharacterModalId);
        navigate(`/play/${sessionId}/${characterId}`);
    };

    const createCharacterAndJoin = async (
        gameId: GameId,
        sessionId: number
    ) => {
        if (isGameId(gameId)) {
            const char = await createCharacter({
                data: {
                    gameId,
                    name: 'New',
                    data: getGame(gameId).default
                },
                isRefresh: false,
                isToast: true
            });
            joinSession(sessionId, char.id);
        } else {
            throw new Error(`Unexpected game ID ${gameId}`);
        }
    };

    const onJoinSession = (
        gameId: GameId,
        sessionId: number,
        isMaster = false
    ) => {
        if (isMaster) {
            navigate(`/play/${sessionId}`);
        } else {
            modals.open({
                modalId: selectCharacterModalId,
                centered: true,
                title: T('page.sessions.joinSession'),
                children: (
                    <JoinSessionModal
                        gameId={gameId}
                        characters={characterList}
                        onSelect={(characterId: number) => {
                            joinSession(sessionId, characterId);
                        }}
                        onCreate={() => {
                            createCharacterAndJoin(gameId, sessionId);
                        }}
                    />
                )
            });
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
                {sessionList.length ? (
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
                                const isMaster = master?.id === user.id;
                                return (
                                    <Table.Tr key={`session-${id}`}>
                                        <Table.Td>
                                            <ActionIcon
                                                onClick={() =>
                                                    onJoinSession(
                                                        gameId,
                                                        id,
                                                        isMaster
                                                    )
                                                }
                                            >
                                                <GiRollingDices />
                                            </ActionIcon>
                                        </Table.Td>
                                        <Table.Td>{name}</Table.Td>
                                        <Table.Td>
                                            {getGame(gameId)?.name}
                                        </Table.Td>
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
                                                        onDeleteSession(
                                                            id,
                                                            name
                                                        )
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
                ) : (
                    <Alert
                        w="100%"
                        variant="default"
                        color="gray"
                        title={T('page.sessions.noSession')}
                        icon={<FaInfo />}
                    />
                )}
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
