import { DicesRequest, PlaySocket } from '../../../types';

export interface DiceHookExport {
    requestDice: (request: DicesRequest, isPrivate: boolean) => void;
}

export const defaultDiceHookExport: DiceHookExport = {
    requestDice: () => {}
};

const useDice = (socket: PlaySocket | null) => {
    const requestDice = (request: DicesRequest, isPrivate: boolean) => {
        socket?.emit(isPrivate ? 'dicePrivateRequest' : 'diceRequest', request);
    };

    const getDiceResultLog = (
        request: DicesRequest,
        result: number,
        isPrivate: boolean = false
    ) => {
        const requestText = Object.entries(request).map(([type, count]) => (
            `${count}${type}`
        )).join(' + ');
        const privatly = isPrivate ? 'privatly ' : '';
        return `${privatly}rolled ${requestText} and the result is ${result}`;
    };

    return {
        requestDice,
        getDiceResultLog
    };
};

export default useDice;
