import { type DicesRequest, type PlaySocket } from '../../../types/index.js';
import { useApp } from '../../contexts/App.js';

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
        isPrivate: boolean = false
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
