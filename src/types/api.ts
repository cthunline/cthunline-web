export interface UserData {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isEnabled: boolean;
}

export interface CharacterData {
    id: string;
    userId: string;
    gameId: string;
    name: string;
    data: object;
}

export interface GameData {
    id: string;
    name: string;
}
