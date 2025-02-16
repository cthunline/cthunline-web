import { type ManagerOptions, type SocketOptions, io } from 'socket.io-client';

import type { SocketClient, SocketClientCustomData } from '../types/socket.js';

export const createSocketClient = ({
    data: { user, isMaster, sessionId, characterId },
    ...options
}: Partial<ManagerOptions & SocketOptions> & {
    data: SocketClientCustomData;
}): SocketClient => {
    const client = io(options) as SocketClient;
    client.user = user;
    client.isMaster = isMaster;
    client.sessionId = sessionId;
    client.characterId = characterId;
    return client;
};
