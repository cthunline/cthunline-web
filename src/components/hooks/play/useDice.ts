import { DicesRequest, PlaySocket } from '../../../types';
import { useApp } from '../../contexts/App';

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
        const privatly = isPrivate ? `${t('common.privatly')} ` : '';
        const resultText = t('page.play.event.diceResult', {
            request: requestText,
            result: String(result)
        });
        return `${privatly}${resultText}`;
    };

    return {
        requestDice,
        getDiceResultLog
    };
};

export default useDice;
