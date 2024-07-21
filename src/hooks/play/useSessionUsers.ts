import { useCallback, useState } from 'react';

import type { Character, PlaySocket, SessionUser } from '../../types/index.js';

export interface SessionUsersHookExport {
    users: SessionUser[];
    characterUpdate: () => void;
}

export const defaultSessionUsersHookExport: SessionUsersHookExport = {
    users: [],
    characterUpdate: () => {
        /* default */
    }
};

const useSessionUsers = (socket: PlaySocket | null) => {
    const [users, setUsers] = useState<SessionUser[]>([]);

    const updateUserCharacter = (userId: number, character: Character) => {
        setUsers((previous) =>
            previous.map((sessionUser: SessionUser) =>
                sessionUser.id === userId
                    ? {
                          ...sessionUser,
                          character
                      }
                    : sessionUser
            )
        );
    };

    const characterUpdate = useCallback(() => {
        socket?.emit('characterUpdate');
    }, [socket]);

    return {
        users,
        setUsers,
        updateUserCharacter,
        characterUpdate
    };
};

export default useSessionUsers;
