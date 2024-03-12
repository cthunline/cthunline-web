import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdOutlineDeleteOutline, MdOutlineSend } from 'react-icons/md';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    List,
    ListItemButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';

import { getDefaultData } from '../../ui/characterSheet/characterSheet.helper';
import TransferModal, { type TransferData } from './TransferModal';
import useCharacter from '../../hooks/useCharacter';
import { useDialog } from '../../contexts/Dialog';
import { useApp } from '../../contexts/App';
import useGame from '../../hooks/useGame';
import { Game } from '../../../types';

interface TransferModalData {
    isOpen: boolean;
    characterId: number;
}

interface GameSelectorProps {
    games: Game[];
    onSelect: (gameId: string) => void;
}

const GameSelector = ({ games, onSelect }: GameSelectorProps) => (
    <List>
        {games.map(({ id, name }) => (
            <ListItemButton key={id} onClick={() => onSelect(id)}>
                {name}
            </ListItemButton>
        ))}
    </List>
);

const Characters = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const { confirmDialog, openDialog, closeDialog } = useDialog();
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
        closeDialog();
        navigate(`/characters/${char.id}`, {
            replace: true
        });
    };

    const onGameSelect = () => {
        openDialog({
            title: T('page.characters.selectGame'),
            content: <GameSelector games={gameList} onSelect={onCreate} />
        });
    };

    const onTransfer = (characterId: number) => {
        setTransferModalData({
            characterId,
            isOpen: true
        });
    };

    const onTransferModalClose = () => {
        setTransferModalData({
            characterId: 0,
            isOpen: false
        });
    };

    const onTransferModalConfirm = ({ characterId, userId }: TransferData) => {
        setTransferModalData({
            characterId: 0,
            isOpen: false
        });
        confirmDialog(T('page.characters.transferCharacterConfirm'), () => {
            transferCharacter({
                characterId,
                userId
            });
        });
    };

    const onEdit = (characterId: number) => {
        navigate(`/characters/${characterId}`);
    };

    const onDelete = (characterId: number, name: string) => {
        const confirmText = T('page.characters.deleteCharacterConfirm', {
            name
        });
        confirmDialog(confirmText, () => {
            deleteCharacter({
                characterId
            });
        });
    };

    return (
        <Paper
            elevation={3}
            className="page-list p-25 flex column start-x center-y"
        >
            <Typography variant="h6" gutterBottom>
                {T('entity.characters')}
            </Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{T('entity.game')}</TableCell>
                            <TableCell>{T('common.name')}</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characterList.map(({ id, name, gameId }) => (
                            <TableRow key={id}>
                                <TableCell>{getGame(gameId)?.name}</TableCell>
                                <TableCell>
                                    {name.trim() || `[${T('common.unknown')}]`}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="medium"
                                        onClick={() => onTransfer(id)}
                                    >
                                        <MdOutlineSend />
                                    </IconButton>{' '}
                                    <IconButton
                                        size="medium"
                                        onClick={() => onEdit(id)}
                                    >
                                        <MdEdit />
                                    </IconButton>{' '}
                                    <IconButton
                                        size="medium"
                                        color="error"
                                        onClick={() => onDelete(id, name)}
                                    >
                                        <MdOutlineDeleteOutline />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="flex row end-x full-width mt-20">
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<HiPlus />}
                    onClick={onGameSelect}
                >
                    {T('action.create')}
                </Button>
            </Box>
            <TransferModal
                open={transferModalData.isOpen}
                characterId={transferModalData.characterId}
                onConfirm={onTransferModalConfirm}
                onClose={onTransferModalClose}
            />
        </Paper>
    );
};

export default Characters;
