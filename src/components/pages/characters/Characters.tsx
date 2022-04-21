import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { HiPlus } from 'react-icons/hi';
import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';

import { Game } from '../../../types';
import { useApp } from '../../contexts/App';
import { useDialog } from '../../contexts/Dialog';
import useCharacter from '../../hooks/useCharacter';
import useGame from '../../hooks/useGame';

interface GameSelectorProps {
    games: Game[];
    onSelect: (id: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
    games,
    onSelect
}) => (
    <List>
        {games.map(({ id, name }) => (
            <ListItemButton
                key={id}
                onClick={() => onSelect(id)}
            >
                {name}
            </ListItemButton>
        ))}
    </List>
);

const Characters: React.FC = () => {
    const { T } = useApp();
    const navigate = useNavigate();
    const {
        confirmDialog,
        openDialog,
        closeDialog
    } = useDialog();
    const { getGame, gameList } = useGame();
    const {
        characterList,
        deleteCharacter
    } = useCharacter({
        loadList: true
    });

    const onCreate = () => {
        openDialog({
            title: T('page.characters.selectGame'),
            content: (
                <GameSelector
                    games={gameList}
                    onSelect={(gameId) => {
                        closeDialog();
                        navigate(`/characters/create/${gameId}`);
                    }}
                />
            )
        });
    };

    const onEdit = (characterId: string) => {
        navigate(`/characters/${characterId}`);
    };

    const onDelete = (characterId: string, name: string) => {
        const confirmText = T('page.characters.deleteCharacterConfirm', { name });
        confirmDialog(confirmText, () => {
            deleteCharacter({
                characterId
            });
        });
    };

    return (
        <Paper elevation={3} className="page-list p-25 flex column start-x center-y">
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
                        {characterList.map(({
                            id,
                            name,
                            gameId
                        }) => (
                            <TableRow key={id}>
                                <TableCell>
                                    {getGame(gameId)?.name}
                                </TableCell>
                                <TableCell>
                                    {name}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="medium"
                                        onClick={() => onEdit(id)}
                                    >
                                        <MdEdit />
                                    </IconButton>
                                    {' '}
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
                    onClick={onCreate}
                >
                    {T('action.create')}
                </Button>
            </Box>
        </Paper>
    );
};

export default Characters;
