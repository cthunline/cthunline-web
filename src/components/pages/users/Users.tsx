import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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

import useUser from '../../hooks/useUser';
import { useAuth } from '../../contexts/Auth';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
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

    return (
        <Paper elevation={3} className="page-list box flex column start">
            <Typography variant="h6" gutterBottom>
                Users
            </Typography>
            <TableContainer>
                <Table>
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

export default Users;
