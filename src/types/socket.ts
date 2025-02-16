import type { Socket } from 'socket.io-client';

import type {
    Asset,
    Character,
    DiceAlienRequestBody,
    DiceAlienResponseBody,
    DiceRequestBody,
    DiceResponseBody,
    Note,
    SessionUser,
    SketchData,
    SketchTokenData,
    User
} from './index.js';

export type SocketClient = Socket<ListenEvents, EmitEvents> &
    SocketClientCustomData;

export type SocketClientCustomData = {
    user: User;
    sessionId: number;
    isMaster: boolean;
    characterId?: number;
};

type EmitEvents = {
    sketchUpdate: (data: SocketSketchUpdateRequest) => void;
    tokenUpdate: (data: SketchTokenData) => void;
    diceRequest: (data: DiceRequestBody) => void;
    dicePrivateRequest: (data: DiceRequestBody) => void;
    diceAlienRequest: (data: DiceAlienRequestBody) => void;
    diceAlienPrivateRequest: (data: DiceAlienRequestBody) => void;
    audioPlay: (data: SocketAudioPlayRequest) => void;
    audioStop: () => void;
    characterUpdate: () => void;
    noteUpdate: (data: SocketNoteUpdateRequest) => void;
    noteDelete: (data: SocketNoteUpdateRequest) => void;
};

type ListenEvents = {
    error: (data: SocketErrorData) => void;
    join: (data: SocketConnectData) => void;
    leave: (data: SocketConnectData) => void;
    sketchUpdate: (data: SocketSketchUpdateData) => void;
    diceResult: (data: SocketDiceResultData) => void;
    diceAlienResult: (data: DiceAlienResponseBody) => void;
    audioPlay: (data: SocketAudioPlayData) => void;
    audioStop: (data: SocketBaseData) => void;
    characterUpdate: (data: SocketCharacterUpdateData) => void;
    noteUpdate: (data: SocketNoteUpdateData) => void;
    noteDelete: (data: SocketNoteDeleteData) => void;
};

type SocketMeta<T> = T & {
    dateTime: string;
};

type SocketBaseData = {
    user: User;
    isMaster: boolean;
};

type SocketConnectData = SocketMeta<
    SocketBaseData & {
        users: SessionUser[];
    }
>;

type SocketSketchUpdateRequest = Omit<SketchData, 'events'>;

type SocketSketchUpdateData = SocketMeta<
    SocketBaseData & {
        sketch: SocketSketchUpdateRequest;
    }
>;

type SocketDiceResultData = SocketMeta<DiceResponseBody>;

type SocketAudioPlayData = SocketMeta<
    SocketBaseData & {
        asset: Asset;
        time?: number;
    }
>;

type SocketCharacterUpdateData = SocketMeta<
    SocketBaseData & {
        character: Character;
    }
>;

type SocketNoteUpdateData = SocketMeta<
    SocketBaseData & {
        note: Note;
    }
>;

type SocketNoteDeleteData = SocketMeta<
    SocketBaseData & {
        noteId: number;
    }
>;

type SocketAudioPlayRequest = {
    assetId: number;
    time?: number;
};

type SocketNoteUpdateRequest = {
    noteId: number;
};

type SocketErrorData = {
    message: string;
    status?: number;
};
