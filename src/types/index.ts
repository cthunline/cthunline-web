import { Socket } from 'socket.io-client';

import { CoCCharacterData } from './games/callOfCthulhu';
import { SWD6CharacterData } from './games/starWarsD6';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ theme

export enum Theme {
    dark = 'dark',
    light = 'light'
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ translation

export enum Locale {
    en = 'en',
    fr = 'fr'
}

export const languages: Record<Locale, string> = {
    en: 'english',
    fr: 'français'
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ configuration

export interface Configuration {
    registrationEnabled: boolean;
    invitationEnabled: boolean;
    defaultTheme: Theme;
    defaultLocale: Locale;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ colors

export const colors = [
    'black',
    'white',
    'yellow',
    'orange',
    'brown',
    'red',
    'purple',
    'turquoise',
    'blue',
    'darkblue',
    'green',
    'darkgreen',
    'gray',
    'darkgray'
] as const;

export type Color = typeof colors[number];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ user

export interface User {
    id: string;
    name: string;
    email: string;
    theme: Theme;
    locale: Locale;
    isAdmin: boolean;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserCreateBody {
    name: string;
    email: string;
    password: string;
    theme?: Theme;
    locale?: Locale;
    isAdmin?: boolean;
}

export interface UserEditBody extends Partial<UserCreateBody> {
    oldPassword?: string;
    isEnabled?: boolean;
}

export interface UserRegisterBody extends Omit<UserCreateBody, 'isAdmin'> {
    invitationCode?: string;
}

export interface SessionUser extends User {
    character: Character;
    isMaster: boolean;
    socketId: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ asset

export interface Asset {
    id: string;
    userId: string;
    directoryId?: string;
    type: 'audio' | 'image';
    name: string;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssetCreateBody {
    assets: File[];
    directoryId?: string;
}

export interface Directory {
    id: string;
    userId: string;
    parentId?: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface DirectoryCreateBody {
    name: string;
    parentId?: string;
}

export type DirectoryEditBody = Partial<Omit<DirectoryCreateBody, 'parentId'>>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ session

export interface Session {
    id: string;
    masterId: string;
    master?: User;
    gameId: string;
    name: string;
    sketch: SketchData;
    createdAt: string;
    updatedAt: string;
}

export interface SessionCreateBody {
    gameId: string;
    name: string;
    sketch?: object;
}

export type SessionEditBody = Partial<Omit<SessionCreateBody, 'gameId'>>;

export interface Note {
    id: string;
    sessionId: string;
    userId: string;
    text: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ character

export type CharacterData = CoCCharacterData | SWD6CharacterData;

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

export enum GameId {
    callOfCthulhu = 'callOfCthulhu',
    starWarsD6 = 'starWarsD6'
}

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

export interface PlayLog {
    date: Date;
    text: string;
}

export enum WidgetType {
    character = 'character',
    characters = 'characters',
    dices = 'dices',
    sketch = 'sketch',
    jukebox = 'jukebox',
    notes = 'notes'
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
    tokens: SketchTokenData[];
    events: SketchEvent[];
}

export interface SketchImageData {
    url: string;
    width: number;
    height?: number;
    x: number;
    y: number;
}

export enum SketchItemType {
    image = 'image',
    token = 'token'
}

export interface SketchMovingItemData {
    type: SketchItemType;
    index: number;
    element: SVGSVGElement;
    deltaX: number;
    deltaY: number;
    initialX: number;
    initialY: number;
    movableByUser?: boolean;
}

export interface SketchResizingItemData {
    type: SketchItemType;
    index: number;
    element: SVGSVGElement;
    direction: CardinalDirection;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialMouseX: number;
    initialMouseY: number;
}

export type SketchTokenUserData = Pick<SessionUser, 'id' | 'name'>;

export interface SketchTokenData {
    color: Color;
    user: SketchTokenUserData | null;
    x: number;
    y: number;
    tooltipPlacement: TooltipPlacement;
}

export type SketchTokenUser = Pick<User, 'id' | 'name'>;

export enum SketchEventType {
    draw = 'draw',
    imageAdd = 'imageAdd',
    imageMove = 'imageMove',
    imageResize = 'imageResize',
    imageDelete = 'imageDelete',
    imageForward = 'imageForward',
    imageBackward = 'imageBackward',
    tokenAdd = 'tokenAdd',
    tokenMove = 'tokenMove',
    tokenDelete = 'tokenDelete'
}

export interface SketchEvent {
    // type of event
    type: SketchEventType;
    // index of image concerned by the event
    imageIndex?: number;
    // image data to restore if event is undone
    imageData?: SketchImageData;
    // index of token concerned by the event
    tokenIndex?: number;
    // token data to restore if event is undone
    tokenData?: SketchTokenData;
}

export interface SketchCoordinates {
    x: number;
    y: number;
    tooltipPlacement?: TooltipPlacement;
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

export enum TooltipPlacement {
    top = 'top',
    right = 'right',
    bottom = 'bottom',
    left = 'left'
}
