import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
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

import SessionForm from './SessionForm';
import { useApp } from '../../contexts/App';
import { useDialog } from '../../contexts/Dialog';
import useGame from '../../hooks/useGame';
import useCharacter from '../../hooks/useCharacter';
import useSession from '../../hooks/useSession';
import { Character, SessionCreateBody } from '../../../types';

interface CharacterSelectorProps {
    characters: Character[];
    onSelect: (charId: number) => void;
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
    const { T, user } = useApp();
    const navigate = useNavigate();
    const {
        confirmDialog,
        openDialog,
        closeDialog
    } = useDialog();
    const { getGame } = useGame();
    const { characterList } = useCharacter({
        loadList: true
    });
    const {
        sessionList,
        deleteSession,
        createSession
    } = useSession({
        loadList: true
    });

    const onJoin = (gameId: string, sessionId: number, isMaster: boolean = false) => {
        const charList = characterList.filter(({ gameId: charGameId }) => (
            charGameId === gameId
        ));
        if (isMaster) {
            navigate(`/play/${sessionId}`);
        } else if (charList.length) {
            openDialog({
                title: T('page.sessions.selectCharacter'),
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
            toast.error(T('page.sessions.error.noCharacterAvailable'));
        }
    };

    const onSubmitSession = async (data: SessionCreateBody) => {
        await createSession({ data });
        closeDialog();
    };

    const onCreateSession = () => {
        openDialog({
            title: T('page.sessions.newSession'),
            content: (
                <SessionForm onSubmit={onSubmitSession} />
            )
        });
    };

    const onDeleteSession = (sessionId: number, name: string) => {
        const confirmText = T('page.sessions.deleteSessionConfirm', { name });
        confirmDialog(confirmText, () => {
            deleteSession({
                sessionId
            });
        });
    };

    return (
        <Paper elevation={3} className="page-list p-25 flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                {T('entity.sessions')}
            </Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>{T('common.name')}</TableCell>
                            <TableCell>{T('entity.game')}</TableCell>
                            <TableCell>{T('entity.gameMaster')}</TableCell>
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
                                                <Chip label={T('common.itsYou')} size="small" />
                                            </>
                                        ) : null}
                                    </TableCell>
                                    <TableCell align="right">
                                        {isMaster ? (
                                            <IconButton
                                                size="medium"
                                                color="error"
                                                onClick={() => onDeleteSession(id, name)}
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
            <Box className="flex row end-x full-width mt-20">
                <Button
                    className="create-button"
                    variant="contained"
                    size="medium"
                    startIcon={<HiPlus />}
                    onClick={onCreateSession}
                >
                    {T('action.create')}
                </Button>
            </Box>
        </Paper>
    );
};

export default Sessions;
