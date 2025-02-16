import { useApp } from '../../contexts/App.js';
import type {
    DicesRequestBody,
    DicesResponseBody,
    PlaySocket
} from '../../types/index.js';

export interface DiceHookExport {
    requestDice: (request: DicesRequestBody, isPrivate: boolean) => void;
}

export const defaultDiceHookExport: DiceHookExport = {
    requestDice: () => {
        /* default */
    }
};

const useDice = (socket: PlaySocket | null) => {
    const { t } = useApp();

    const requestDice = (request: DicesRequestBody, isPrivate: boolean) => {
        socket?.emit(isPrivate ? 'dicePrivateRequest' : 'diceRequest', request);
    };

    const getDiceResultLog = ({
        isPrivate,
        aggregatedRolls,
        results,
        total
    }: Pick<
        DicesResponseBody,
        'isPrivate' | 'aggregatedRolls' | 'results' | 'total'
    >) => {
        const requestText = Object.entries(aggregatedRolls)
            .map(([dType, dCount]) => `${dCount}${dType}`)
            .join(', ');
        const resultsParts: React.ReactNode[] = [];
        if (results.length > 1) {
            for (const { color, result } of results) {
                if (resultsParts.length) {
                    resultsParts.push(', ');
                }
                if (color) {
                    resultsParts.push(
                        <span style={{ color: `var(--palette-${color})` }}>
                            {result}
                        </span>
                    );
                } else {
                    resultsParts.push(result);
                }
            }
        }
        const resultsContent =
            results.length > 1 ? [' (', ...resultsParts, ')'] : '';
        const textKey = `page.play.event.${isPrivate ? 'dicePrivateResult' : 'diceResult'}`;
        return (
            <>
                {t(textKey, {
                    rolls: requestText,
                    total: String(total)
                }).trim()}
                {resultsContent}
            </>
        );
    };

    return {
        requestDice,
        getDiceResultLog
    };
};

export default useDice;
