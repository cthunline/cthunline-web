import React from 'react';
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

import { useApp } from '../../contexts/App';
import { useDialog } from '../../contexts/Dialog';
import useUser from '../../hooks/useUser';
import Invitation from './Invitation';
import UserForm, { UserSubmitData } from '../../ui/userForm/UserForm';

const Users: React.FC = () => {
    const { T, configuration, user } = useApp();
    const { openDialog, closeDialog } = useDialog();
    const { userList, editUser, createUser } = useUser({
        loadList: true,
        listDisabled: true
    });

    const onSubmit = async (data: UserSubmitData) => {
        await createUser({ data });
        closeDialog();
    };

    const onCreate = () => {
        openDialog({
            title: T('page.users.newUser'),
            content: <UserForm onSubmit={onSubmit} />
        });
    };

    const onInvite = () => {
        openDialog({
            title: T('user.invitationCode'),
            content: <Invitation />
        });
    };

    return (
        <Paper
            elevation={3}
            className="page-list p-25 flex column start-x center-y"
        >
            <Typography variant="h6" gutterBottom>
                {T('entity.users')}
            </Typography>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{T('common.name')}</TableCell>
                            <TableCell>{T('user.email')}</TableCell>
                            <TableCell>{T('user.admin')}</TableCell>
                            <TableCell>{T('status.enabled')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map(
                            ({ id, name, email, isAdmin, isEnabled }) => {
                                const itsYou = id === user?.id;
                                return (
                                    <TableRow key={id}>
                                        <TableCell>
                                            {name}
                                            {itsYou ? (
                                                <>
                                                    {' '}
                                                    <Chip
                                                        label={T(
                                                            'common.itsYou'
                                                        )}
                                                        size="small"
                                                    />
                                                </>
                                            ) : null}
                                        </TableCell>
                                        <TableCell>{email}</TableCell>
                                        <TableCell>
                                            {itsYou ? (
                                                <MdCheck size={25} />
                                            ) : (
                                                <Switch
                                                    size="small"
                                                    checked={isAdmin}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLInputElement>
                                                    ) =>
                                                        editUser({
                                                            userId: id,
                                                            data: {
                                                                isAdmin:
                                                                    e.target
                                                                        .checked
                                                            }
                                                        })
                                                    }
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
                                                    ) =>
                                                        editUser({
                                                            userId: id,
                                                            data: {
                                                                isEnabled:
                                                                    e.target
                                                                        .checked
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="flex row end-x full-width mt-20">
                {configuration.registrationEnabled &&
                configuration.invitationEnabled ? (
                    <Button
                        className="mr-10"
                        variant="contained"
                        size="medium"
                        startIcon={<FaRegHandshake />}
                        onClick={onInvite}
                    >
                        {T('action.invite')}
                    </Button>
                ) : null}
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

export default Users;
