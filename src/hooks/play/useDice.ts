import { useApp } from '../../contexts/App.js';
import type { DicesRequest, PlaySocket } from '../../types/index.js';

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
        request: DicesRequest,
        result: number,
        isPrivate = false
    ) => {
        const requestText = Object.entries(request)
            .map(([type, count]) => `${count}${type}`)
            .join(' + ');
        const textKey = `page.play.event.${isPrivate ? 'dicePrivateResult' : 'diceResult'}`;
        return t(textKey, {
            request: requestText,
            result: String(result)
        });
    };

    return {
        requestDice,
        getDiceResultLog
    };
};

export default useDice;
