import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Switch,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import { MdCheck } from 'react-icons/md';
import { FaRegHandshake } from 'react-icons/fa';

import useUser from '../../hooks/useUser';
import { useConfiguration } from '../../contexts/Configuration';
import { useAuth } from '../../contexts/Auth';
import { useDialog } from '../../contexts/Dialog';
import Invitation from './Invitation';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const { configuration } = useConfiguration();
    const { user } = useAuth();
    const { openDialog } = useDialog();
    const {
        userList,
        editUser
    } = useUser({
        loadList: true,
        listDisabled: true
    });

    const onCreate = () => {
        navigate('/users/create');
    };

    const onInvite = () => {
        openDialog({
            title: 'Invitation code',
            content: <Invitation />
        });
    };

    return (
        <Paper elevation={3} className="page-list box flex column start-x center-y">
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Enabled</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map(({
                            id,
                            name,
                            email,
                            isAdmin,
                            isEnabled
                        }) => {
                            const itsYou = id === user?.id;
                            return (
                                <TableRow key={id}>
                                    <TableCell>
                                        {name}
                                        {itsYou ? (
                                            <>
                                                {' '}
                                                <Chip label="It's you!" size="small" />
                                            </>
                                        ) : null}
                                    </TableCell>
                                    <TableCell>
                                        {email}
                                    </TableCell>
                                    <TableCell>
                                        {itsYou ? (
                                            <MdCheck size={25} />
                                        ) : (
                                            <Switch
                                                size="small"
                                                checked={isAdmin}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => (
                                                    editUser({
                                                        userId: id,
                                                        data: {
                                                            isAdmin: e.target.checked
                                                        }
                                                    })
                                                )}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {itsYou ? (
                                            <MdCheck size={25} />
                                        ) : (
                                            <Switch
                                                size="small"
                                                checked={isEnabled}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => (
                                                    editUser({
                                                        userId: id,
                                                        data: {
                                                            isEnabled: e.target.checked
                                                        }
                                                    })
                                                )}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="flex row end-x full-width mt-20">
                {configuration.registrationEnabled && configuration.invitationEnabled ? (
                    <Button
                        className="mr-10"
                        variant="contained"
                        size="medium"
                        startIcon={<FaRegHandshake />}
                        onClick={onInvite}
                    >
                        Invite user
                    </Button>
                ) : null}
                <Button
                    variant="contained"
                    size="medium"
                    startIcon={<HiPlus />}
                    onClick={onCreate}
                >
                    Create
                </Button>
            </Box>
        </Paper>
    );
};

export default Users;
