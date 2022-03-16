import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
            title: 'Select a game',
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
        confirmDialog(`Delete character ${name} ?`, () => {
            deleteCharacter({
                characterId
            });
        });
    };

    return (
        <Paper elevation={3} className="page-list box flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                Characters
            </Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Game</TableCell>
                            <TableCell>Name</TableCell>
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
            <Button
                className="create-button"
                variant="contained"
                size="medium"
                startIcon={<HiPlus />}
                onClick={onCreate}
            >
                Create
            </Button>
        </Paper>
    );
};

export default Characters;
