import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { MdCheck, MdEdit } from 'react-icons/md';
import { HiPlus } from 'react-icons/hi';

import Api from '../../../services/api';
import { UserData } from '../../../types/api';

import './UserList.css';

interface UsersProps {
    onCreate: () => void;
    onEdit: (userId: string) => void;
}

const UserList: React.FC<UsersProps> = ({ onCreate, onEdit }) => {
    const [userList, setUserList] = useState<UserData[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const { users } = await Api.call({
                    method: 'GET',
                    route: '/users'
                });
                setUserList(users);
            } catch (err: any) {
                toast.error(err.message);
            }
        })();
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
                        }) => (
                            <TableRow key={id}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    {isAdmin ? <MdCheck size={25} /> : null}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(id)}
                                    >
                                        <MdEdit />
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

export default UserList;
