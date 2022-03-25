import { Socket } from 'socket.io-client';

import { CoCCharacterData } from './games/callOfCthulhu';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ user

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreateBody {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export interface UserEditBody extends Partial<UserCreateBody> {
    oldPassword?: string;
    isEnabled?: boolean;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ asset

export interface Asset {
    id: string;
    userId: string;
    type: 'audio' | 'image';
    name: string;
    path: string;
    createdAt: string;
    updatedAt: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ session

export interface Session {
    id: string;
    masterId: string;
    master?: User;
    gameId: string;
    name: string;
    sketch: object;
    createdAt: string;
    updatedAt: string;
}

export interface SessionCreateBody {
    gameId: string;
    name: string;
    sketch?: object;
}

export type SessionEditBody = Partial<Omit<SessionCreateBody, 'gameId'>>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ character

export type CharacterData = CoCCharacterData;

export interface Character<GenericCharacterData = CharacterData> {
    id: string;
    userId: string;
    gameId: string;
    name: string;
    data: GenericCharacterData;
    createdAt: string;
    updatedAt: string;
}

export type CharacterCreateBody = Omit<Character, (
    'id' | 'userId' | 'createdAt' | 'updatedAt'
)>;

export type CharacterEditBody = Partial<Omit<CharacterCreateBody, 'gameId'>>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ game

export interface Game {
    id: string;
    name: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ play

export interface PlaySocket extends Socket {
    user: User;
    sessionId: string;
    isMaster: boolean;
    characterId?: string;
}

export interface SessionUser extends User {
    character: Character;
    isMaster: boolean;
    socketId: string;
}

export interface PlayLog {
    date: Date;
    text: string;
}

export enum WidgetType {
    character = 'character',
    characters = 'characters',
    dices = 'dices',
    sketch = 'sketch',
    jukebox = 'jukebox'
}

export type DiceType = 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20' | 'D100';

export type DicesData = Record<DiceType, number>;

export type DicesRequest = Partial<DicesData>;

export const diceTypes: DiceType[] = ['D4', 'D6', 'D8', 'D10', 'D12', 'D20', 'D100'];

export interface AudioData extends Asset {
    time: number;
    playing: boolean;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ play sketch

export interface SketchData {
    displayed: boolean;
    paths: string[];
    images: SketchImageData[];
    events: SketchEvent[];
}

export interface SketchImageData {
    url: string;
    width: number;
    height?: number;
    x: number;
    y: number;
}

export interface SketchMovingImageData {
    index: number;
    deltaX: number;
    deltaY: number;
}

export interface SketchResizingImageData {
    index: number;
    direction: CardinalDirection;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialMouseX: number;
    initialMouseY: number;
}

export enum SketchEvent {
    draw = 'draw',
    imageAdd = 'imageAdd',
    imageMove = 'imageMove',
    imageResize = 'imageResize'
}

export interface SketchCoordinates {
    x: number;
    y: number;
}

export interface SketchSize {
    width: number;
    height: number;
}

export enum CardinalDirection {
    nw = 'nw',
    ne = 'ne',
    se = 'se',
    sw = 'sw'
}
