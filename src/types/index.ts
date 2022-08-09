import { Socket } from 'socket.io-client';
import {
    CoCCharacter,
    DnD5Character,
    SeventhSeaCharacter,
    SWD6Character
} from '@cthunline/games';

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
    id: number;
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
    id: number;
    userId: number;
    directoryId?: number;
    type: 'audio' | 'image';
    name: string;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssetCreateBody {
    assets: File[];
    directoryId?: number;
}

export interface Directory {
    id: number;
    userId: number;
    parentId?: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface DirectoryCreateBody {
    name: string;
    parentId?: number;
}

export type DirectoryEditBody = Partial<Omit<DirectoryCreateBody, 'parentId'>>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ session

export interface Session {
    id: number;
    masterId: number;
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ note

export interface Note {
    id: number;
    title: string;
    text: string;
    position: number;
    isShared: boolean;
    sessionId: number;
    userId: number;
    user?: User;
}

export interface NoteCreateBody {
    title: string;
    text?: string;
    isShared?: boolean;
}

export type NoteEditBody = Partial<NoteCreateBody>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ character

export type CharacterData =
    CoCCharacter
    | DnD5Character
    | SeventhSeaCharacter
    | SWD6Character;

export interface Character<GenericCharacterData = CharacterData> {
    id: number;
    userId: number;
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
    dnd5 = 'dnd5',
    seventhSea = 'seventhSea',
    starWarsD6 = 'starWarsD6'
}

export interface Game {
    id: string;
    name: string;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ play

export interface PlaySocket extends Socket {
    user: User;
    sessionId: number;
    isMaster: boolean;
    characterId?: number;
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
    id: string;
    index: number;
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
    id: string;
    element: SVGSVGElement;
    deltaX: number;
    deltaY: number;
    initialX: number;
    initialY: number;
    movableByUser?: boolean;
}

export interface SketchResizingItemData {
    type: SketchItemType;
    id: string;
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
    id: string;
    index: number;
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
    // image data to restore if event is undone
    image?: SketchImageData;
    // token data to restore if event is undone
    token?: SketchTokenData;
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ user's sketch

export interface UserSketch {
    id: number;
    userId: number;
    name: string;
    sketch: Omit<SketchData, 'events'>;
    createdAt: string;
    updatedAt: string;
}

export type UserSketchCreateBody = Pick<UserSketch, 'name' | 'sketch'>;
