import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    List,
    ListItemButton
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { GiRollingDices } from 'react-icons/gi';
import { toast } from 'react-toastify';

import { useDialog } from '../../contexts/Dialog';
import { useAuth } from '../../contexts/Auth';
import useGame from '../../hooks/useGame';
import useCharacter from '../../hooks/useCharacter';
import useSession from '../../hooks/useSession';
import { Character } from '../../../types';

interface CharacterSelectorProps {
    characters: Character[];
    onSelect: (id: string) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
    characters,
    onSelect
}) => (
    <List>
        {characters.map(({ id, name }) => (
            <ListItemButton
                key={id}
                onClick={() => onSelect(id)}
            >
                {name}
            </ListItemButton>
        ))}
    </List>
);

const Sessions: React.FC = () => {
    const navigate = useNavigate();
    const {
        confirmDialog,
        openDialog,
        closeDialog
    } = useDialog();
    const { user } = useAuth();
    const { getGame } = useGame();
    const { characterList } = useCharacter({
        loadList: true
    });
    const { sessionList, deleteSession } = useSession({
        loadList: true
    });

    const onJoin = (gameId: string, sessionId: string, isMaster: boolean = false) => {
        const charList = characterList.filter(({ gameId: charGameId }) => (
            charGameId === gameId
        ));
        if (isMaster) {
            navigate(`/play/${sessionId}`);
        } else if (charList.length) {
            openDialog({
                title: 'Select a character',
                content: (
                    <CharacterSelector
                        characters={charList}
                        onSelect={(characterId) => {
                            closeDialog();
                            navigate(`/play/${sessionId}/${characterId}`);
                        }}
                    />
                )
            });
        } else {
            toast.error('No character available for this game');
        }
    };

    const onCreate = () => {
        navigate('/sessions/create');
    };

    const onDelete = (sessionId: string, name: string) => {
        confirmDialog(`Delete session ${name} ?`, () => {
            deleteSession({
                sessionId
            });
        });
    };

    return (
        <Paper elevation={3} className="page-list box flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                Sessions
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Name</TableCell>
                            <TableCell>Game</TableCell>
                            <TableCell>Game Master</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessionList.map(({
                            id,
                            name,
                            gameId,
                            master
                        }) => {
                            const isMaster = master?.id === user?.id;
                            return (
                                <TableRow key={id}>
                                    <TableCell>
                                        <IconButton
                                            size="medium"
                                            color="primary"
                                            onClick={() => onJoin(gameId, id, isMaster)}
                                        >
                                            <GiRollingDices />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        {name}
                                    </TableCell>
                                    <TableCell>
                                        {getGame(gameId)?.name}
                                    </TableCell>
                                    <TableCell>
                                        {master?.name}
                                        {isMaster ? (
                                            <>
                                                {' '}
                                                <Chip label="It's you!" size="small" />
                                            </>
                                        ) : null}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isMaster ? (
                                            <IconButton
                                                size="medium"
                                                color="error"
                                                onClick={() => onDelete(id, name)}
                                            >
                                                <MdOutlineDeleteOutline />
                                            </IconButton>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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

export default Sessions;
