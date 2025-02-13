import { useApp } from '../../contexts/App.js';
import type {
    DiceType,
    DicesRequest,
    DicesResultDetails,
    PlaySocket
} from '../../types/index.js';

export interface DiceHookExport {
    requestDice: (request: DicesRequest, isPrivate: boolean) => void;
}

export const defaultDiceHookExport: DiceHookExport = {
    requestDice: () => {
        /* default */
    }
};

const useDice = (socket: PlaySocket | null) => {
    const { t } = useApp();

    const requestDice = (request: DicesRequest, isPrivate: boolean) => {
        socket?.emit(isPrivate ? 'dicePrivateRequest' : 'diceRequest', request);
    };

    const getDiceResultLog = (
        details: DicesResultDetails,
        total: number,
        isPrivate = false
    ) => {
        const requestRolls: string[] = [];
        const detailsResults: number[][] = [];
        for (const [dType, dResults] of Object.entries(details) as [
            DiceType,
            number[]
        ][]) {
            requestRolls.push(`${dResults.length}${dType}`);
            detailsResults.push(dResults);
        }
        const results: number[] = detailsResults.flat();
        const requestText = requestRolls.join(', ');
        const detailsText = results.length > 1 ? `(${results.join(', ')})` : '';
        const textKey = `page.play.event.${isPrivate ? 'dicePrivateResult' : 'diceResult'}`;
        return t(textKey, {
            request: requestText,
            result: String(total),
            details: detailsText
        }).trim();
    };

    return {
        requestDice,
        getDiceResultLog
    };
};

export default useDice;
