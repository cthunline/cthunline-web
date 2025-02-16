import { type GameId, gameIds, getGame, isGameId } from '@cthunline/games';
import { ActionIcon, Alert, Button, Table } from '@mantine/core';
import { modals } from '@mantine/modals';
import { FaInfo } from 'react-icons/fa6';
import { HiPlus } from 'react-icons/hi';
import { MdEdit, MdOutlineDeleteOutline, MdOutlineSend } from 'react-icons/md';
import { useNavigate } from 'react-router';

import { useApp } from '../../../contexts/App.js';
import useCharacter from '../../../hooks/api/useCharacter.js';
import ContentBox from '../../common/ContentBox.js';
import Select from '../../common/Select.js';
import TransferForm, { type TransferData } from './TransferForm.js';

const gameList = gameIds.map((id) => ({
    id,
    name: getGame(id).name
}));

const gameOptions = gameList.map(({ id, name }) => ({
    value: id,
    label: name
}));

interface GameSelectorProps {
    onSelect: (gameId: GameId) => void;
}

const GameSelector = ({ onSelect }: GameSelectorProps) => (
    <Select
        valueType="string"
        options={gameOptions}
        onChange={(gameId: string | null) => {
            if (gameId && isGameId(gameId)) {
                onSelect(gameId);
            }
        }}
    />
);

const createCharacterModalId = 'transfer-character-modal';
const transferCharacterModalId = 'transfer-character-modal';

const Characters = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const {
        characterList,
        createCharacter,
        deleteCharacter,
        transferCharacter
    } = useCharacter({
        loadList: true
    });

    const onCreate = async (gameId: GameId) => {
        const char = await createCharacter({
            data: {
                gameId,
                name: 'New',
                data: getGame(gameId).default
            },
            isRefresh: false,
            isToast: false
        });
        modals.close(createCharacterModalId);
        navigate(`/characters/${char.id}`, {
            replace: true
        });
    };

    const onGameSelect = () => {
        modals.open({
            modalId: createCharacterModalId,
            centered: true,
            title: T('page.characters.selectGame'),
            children: <GameSelector onSelect={onCreate} />
        });
    };

    const onTransferModalConfirm = ({ characterId, userId }: TransferData) => {
        modals.openConfirmModal({
            centered: true,
            title: T('page.characters.transferCharacterConfirm'),
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                transferCharacter({
                    characterId,
                    userId
                });
            }
        });
    };

    const onTransfer = (characterId: number) => {
        modals.open({
            modalId: transferCharacterModalId,
            centered: true,
            title: T('page.characters.transferCharacter'),
            children: (
                <TransferForm
                    characterId={characterId}
                    onConfirm={(data: TransferData) => {
                        onTransferModalConfirm(data);
                        modals.close(transferCharacterModalId);
                    }}
                    onCancel={() => modals.close(transferCharacterModalId)}
                />
            )
        });
    };

    const onEdit = (characterId: number) => {
        navigate(`/characters/${characterId}`);
    };

    const onDelete = (characterId: number, name: string) => {
        const confirmText = T('page.characters.deleteCharacterConfirm', {
            name
        });
        modals.openConfirmModal({
            centered: true,
            title: confirmText,
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                deleteCharacter({
                    characterId
                });
            }
        });
    };

    return (
        <ContentBox>
            <ContentBox.Title>{T('entity.characters')}</ContentBox.Title>
            <ContentBox.Content>
                {characterList.length ? (
                    <Table stickyHeader>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{T('entity.game')}</Table.Th>
                                <Table.Th>{T('common.name')}</Table.Th>
                                <Table.Th />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {characterList.map(({ id, name, gameId }) => (
                                <Table.Tr key={`character-${id}`}>
                                    <Table.Td>{getGame(gameId)?.name}</Table.Td>
                                    <Table.Td>
                                        {name.trim() ||
                                            `[${T('common.unknown')}]`}
                                    </Table.Td>
                                    <Table.Td align="right">
                                        <ActionIcon
                                            onClick={() => onTransfer(id)}
                                        >
                                            <MdOutlineSend />
                                        </ActionIcon>{' '}
                                        <ActionIcon onClick={() => onEdit(id)}>
                                            <MdEdit />
                                        </ActionIcon>{' '}
                                        <ActionIcon
                                            color="red"
                                            onClick={() => onDelete(id, name)}
                                        >
                                            <MdOutlineDeleteOutline />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Alert
                        w="100%"
                        variant="default"
                        color="gray"
                        title={T('page.characters.noCharacter')}
                        icon={<FaInfo />}
                    />
                )}
            </ContentBox.Content>
            <ContentBox.Footer>
                <Button leftSection={<HiPlus />} onClick={onGameSelect}>
                    {T('action.create')}
                </Button>
            </ContentBox.Footer>
        </ContentBox>
    );
};

export default Characters;
