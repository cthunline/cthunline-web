import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Button,
    Switch,
    IconButton,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import { MdCheck, MdOutlineDeleteOutline } from 'react-icons/md';

import useUser from '../../hooks/useUser';
import { useAuth } from '../../contexts/Auth';
import { useDialog } from '../../contexts/Dialog';

import './UserList.css';

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const dialog = useDialog();
    const {
        userList,
        editUser,
        deleteUser
    } = useUser(true);

    const onCreate = () => {
        navigate('/users/create');
    };

    const onDelete = (userId: string, name: string) => {
        dialog(`Delete user ${name}?`, () => {
            deleteUser(userId);
        });
    };

    const onAdminChange = (userId:string, isAdmin: boolean) => {
        editUser(userId, {
            isAdmin
        });
    };

    return (
        <Paper elevation={3} className="user-list box flex-column start">
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
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map(({
                            id,
                            name,
                            email,
                            isAdmin
                        }) => {
                            const itsYou = id === user?.id;
                            return (
                                <TableRow key={id}>
                                    <TableCell>
                                        {name}
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
                                                    onAdminChange(id, e.target.checked)
                                                )}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {itsYou ? (
                                            <Chip label="It's you!" size="small" />
                                        ) : (
                                            <IconButton
                                                size="medium"
                                                onClick={() => onDelete(id, name)}
                                                color="error"
                                            >
                                                <MdOutlineDeleteOutline />
                                            </IconButton>
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

export default UserList;
