import { MdEdit, MdOutlineDeleteOutline, MdOutlineSend } from 'react-icons/md';
import { ActionIcon, Alert, Button, Table } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { FaInfo } from 'react-icons/fa6';
import { modals } from '@mantine/modals';
import { HiPlus } from 'react-icons/hi';

import { getDefaultData } from '../../features/characterSheet/characterSheet.helper.js';
import { type Game, type SelectOption } from '../../../types/index.js';
import TransferForm, { type TransferData } from './TransferForm.js';
import useCharacter from '../../hooks/useCharacter.js';
import ContentBox from '../../common/ContentBox.js';
import { useApp } from '../../contexts/App.js';
import useGame from '../../hooks/useGame.js';
import Select from '../../common/Select.js';

interface TransferModalData {
    isOpen: boolean;
    characterId: number;
}

interface GameSelectorProps {
    games: Game[];
    onSelect: (gameId: string) => void;
}

const GameSelector = ({ games, onSelect }: GameSelectorProps) => {
    const options: SelectOption<string>[] = useMemo(
        () =>
            games.map(({ id, name }) => ({
                value: id,
                label: name
            })),
        [games]
    );
    return (
        <Select
            valueType="string"
            options={options}
            onChange={(gameId: string | null) => {
                if (gameId) {
                    onSelect(gameId);
                }
            }}
        />
    );
};

const createCharacterModalId = 'transfer-character-modal';
const transferCharacterModalId = 'transfer-character-modal';

const Characters = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const { getGame, gameList } = useGame();
    const {
        characterList,
        createCharacter,
        deleteCharacter,
        transferCharacter
    } = useCharacter({
        loadList: true
    });

    const [transferModalData, setTransferModalData] =
        useState<TransferModalData>({
            characterId: 0,
            isOpen: false
        });

    const onCreate = async (gameId: string) => {
        const char = await createCharacter({
            data: {
                gameId,
                name: 'New',
                data: getDefaultData(gameId)
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
            children: <GameSelector games={gameList} onSelect={onCreate} />
        });
    };

    const onTransferModalConfirm = ({ characterId, userId }: TransferData) => {
        setTransferModalData({
            characterId: 0,
            isOpen: false
        });
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
        setTransferModalData({
            characterId,
            isOpen: true
        });
        modals.open({
            modalId: transferCharacterModalId,
            centered: true,
            title: T('page.characters.selectTransferUser'),
            children: (
                <TransferForm
                    characterId={transferModalData.characterId}
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
