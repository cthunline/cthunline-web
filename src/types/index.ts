import type {
    AlienCharacter,
    ApocalypseWorldCharacter,
    CoCCharacter,
    DnD5Character,
    GameId,
    SWD6Character,
    SeventhSeaCharacter,
    WarhammerFantasyCharacter
} from '@cthunline/games';
import type { Locale } from '@pitininja/vite-translations-client';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ theme

export type Theme = 'dark' | 'light';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ translation

export const languages: Record<Locale, string> = {
    en: 'English',
    fr: 'Français'
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ configuration

export interface Configuration {
    registrationEnabled: boolean;
    invitationEnabled: boolean;
    defaultTheme: Theme;
    defaultLocale: Locale;
    apiVersion: `${number}.${number}.${number}`;
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

export type Color = (typeof colors)[number];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ select

export interface SelectOption<ValueType extends string | number = number> {
    value: ValueType;
    label: string;
    disabled?: boolean;
}

export interface SelectOptionGroup<ValueType extends string | number = number> {
    group: string;
    items: SelectOption<ValueType>[];
}

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
    gameId: GameId;
    name: string;
    sketch: SketchData;
    createdAt: string;
    updatedAt: string;
}

export interface SessionCreateBody {
    gameId: GameId;
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

export type CharacterSheetStatus = 'idle' | 'saving' | 'saved';

export type CharacterData =
    | AlienCharacter
    | ApocalypseWorldCharacter
    | CoCCharacter
    | DnD5Character
    | SeventhSeaCharacter
    | SWD6Character
    | WarhammerFantasyCharacter;

export interface Character<GenericCharacterData = CharacterData> {
    id: number;
    userId: number;
    gameId: GameId;
    name: string;
    portrait: string | null;
    data: GenericCharacterData;
    createdAt: string;
    updatedAt: string;
}

export type CharacterCreateBody = Pick<Character, 'gameId' | 'name' | 'data'>;

export type CharacterEditBody = Partial<Omit<CharacterCreateBody, 'gameId'>>;

export interface PortraitUploadBody {
    portrait: File;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ play

export interface PlayLog {
    id: string;
    date: Date;
    content: React.ReactNode;
}

export type WidgetType =
    | 'character'
    | 'characters'
    | 'dices'
    | 'sketch'
    | 'jukebox'
    | 'notes';

export type WidgetVisibility = 'visible' | 'hidden';

export type DiceType = 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20' | 'D100';

export type DiceRequestRoll = {
    dice: DiceType;
};

export type DiceRequestBody = {
    rolls: DiceRequestRoll[];
};

export type DiceResult = DiceRequestRoll & {
    result: number;
};

export type DiceAggregatedRolls = Partial<Record<DiceType, number>>;

type DiceResponseCommon = {
    dateTime?: boolean | Date | string;
    user: User;
    isMaster: boolean;
    isPrivate: boolean;
};

export type DiceResponseBody = DiceResponseCommon & {
    rolls: DiceRequestRoll[];
    aggregatedRolls: DiceAggregatedRolls;
    total: number;
    results: DiceResult[];
};

export type DiceAlienRequestBody = {
    dices: number;
    stresses: number;
};

export type AlienDiceRoll = DiceRequestRoll & {
    stress: boolean;
};

export type AlienDiceResult = AlienDiceRoll & {
    result: number;
};

export type DiceAlienResponseBody = DiceResponseCommon &
    DiceAlienRequestBody & {
        successes: number;
        panics: number;
        results: AlienDiceResult[];
    };

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ play sketch

export interface SketchData {
    displayed: boolean;
    paths: SketchDrawingPath[];
    images: SketchImageData[];
    texts: SketchTextData[];
    tokens: SketchTokenData[];
    events: SketchEvent[];
}

export interface SketchDrawingPath {
    id: string;
    d: string;
    color: string;
    width: number;
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

export type SketchItemType = 'image' | 'text' | 'token';

export interface SketchSelectedItem {
    type: SketchItemType;
    id: string;
}

export interface SketchMovingItemData {
    type: SketchItemType;
    id: string;
    element: SVGSVGElement | SVGTextElement;
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

export interface SketchTextData {
    id: string;
    index: number;
    text: string;
    fontSize: number;
    color: Color;
    x: number;
    y: number;
}

export interface SketchTokenAttachedData {
    userId: number;
    userName: string;
    characterId: number;
    characterName: string;
}

export interface SketchTokenData {
    id: string;
    index: number;
    color: Color;
    attachedData: SketchTokenAttachedData | null;
    x: number;
    y: number;
    tooltipPlacement: TooltipPlacement;
}

export type SketchEventType =
    | 'drawingAdd'
    | 'drawingDelete'
    | 'imageAdd'
    | 'imageMove'
    | 'imageResize'
    | 'imageDelete'
    | 'imageForward'
    | 'imageBackward'
    | 'textAdd'
    | 'textEdit'
    | 'textMove'
    | 'textUpdate'
    | 'textDelete'
    | 'tokenAdd'
    | 'tokenMove'
    | 'tokenDelete';

export interface SketchEvent {
    // type of event
    type: SketchEventType;
    // drawing data to restore if delete action is undone
    drawing?: SketchDrawingPath & {
        index?: number;
    };
    // image data to restore if  delete action is undone
    image?: SketchImageData;
    // text data to restore if  delete action is undone
    text?: SketchTextData;
    // token data to restore if  delete action is undone
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

export type CardinalDirection = 'nw' | 'ne' | 'se' | 'sw';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sketch

export interface Sketch {
    id: number;
    userId: number;
    name: string;
    data: Omit<SketchData, 'events'>;
    createdAt: string;
    updatedAt: string;
}

export type SketchCreateBody = Pick<Sketch, 'name' | 'data'>;

export type SketchUpdateBody = Partial<SketchCreateBody>;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Statistics

export type Statistics = {
    runningSessions: number;
    totalSessions: number;
    playingUsers: number;
    userCharacterCount: number;
    totalCharacterCount: number;
};
