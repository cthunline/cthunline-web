import { useState } from 'react';

import {
    PlaySocket,
    SessionUser,
    Character
} from '../../../types';

export interface UsersHookExport {
    users: SessionUser[];
    characterUpdate: () => void;
}

export const defaultUsersHookExport: UsersHookExport = {
    users: [],
    characterUpdate: () => { /* default */ }
};

const useUsers = (socket: PlaySocket | null) => {
    const [users, setUsers] = useState<SessionUser[]>([]);

    const updateUserCharacter = (userId: number, character: Character) => {
        setUsers((previous) => (
            previous.map((sessionUser: SessionUser) => (
                sessionUser.id === userId ? {
                    ...sessionUser,
                    character
                } : sessionUser
            ))
        ));
    };

    const characterUpdate = () => {
        socket?.emit('characterUpdate');
    };

    return {
        users,
        setUsers,
        updateUserCharacter,
        characterUpdate
    };
};

export default useUsers;
