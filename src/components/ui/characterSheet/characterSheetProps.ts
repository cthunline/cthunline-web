import { CharacterData } from '../../../types';

export interface CharacterSheetProps {
    readonly: boolean;
    gameId: string;
    data?: CharacterData;
    onChange?: (data: CharacterData) => void;
}

export interface CharacterSheetContentProps<DataType> {
    readonly: boolean;
    data: DataType;
    onChange?: (data: DataType) => void;
}
