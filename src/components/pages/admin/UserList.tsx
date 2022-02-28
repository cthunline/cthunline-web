import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

import { useAuth } from '../../contexts/Auth';
import Api from '../../../services/api';
import { UserData } from '../../../types/api';

import './UserList.css';

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [userList, setUserList] = useState<UserData[]>([]);

    const refreshUserList = async () => {
        try {
            const { users } = await Api.call({
                method: 'GET',
                route: '/users'
            });
            setUserList(users);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const onCreate = () => {
        navigate('/users/create');
    };

    const onDelete = (userId: string) => {
        toast.warn(`TODO delete ${userId}`);
    };

    const onAdminChange = async (userId:string, isAdmin: boolean) => {
        try {
            await Api.call({
                method: 'POST',
                route: `/users/${userId}`,
                body: {
                    isAdmin
                }
            });
            await refreshUserList();
            toast.success('User edited');
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        refreshUserList();
    }, []);

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
                                                onClick={() => onDelete(id)}
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
