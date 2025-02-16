import { useCallback } from 'react';
import { useApp } from '../../contexts/App.js';
import type {
    DiceAlienRequestBody,
    DiceAlienResponseBody,
    DiceRequestBody,
    DiceResponseBody,
    PlaySocket
} from '../../types/index.js';

export interface DiceHookExport {
    requestDice: (req: DiceRequestBody, isPrivate: boolean) => void;
    requestDiceAlien: (req: DiceAlienRequestBody, isPrivate: boolean) => void;
}

export const defaultDiceHookExport: DiceHookExport = {
    requestDice: () => {
        /* default */
    },
    requestDiceAlien: () => {
        /* default */
    }
};

const useDice = (socket: PlaySocket | null) => {
    const { t } = useApp();

    const requestDice = (request: DiceRequestBody, isPrivate: boolean) => {
        socket?.emit(isPrivate ? 'dicePrivateRequest' : 'diceRequest', request);
    };

    const requestDiceAlien = (
        request: DiceAlienRequestBody,
        isPrivate: boolean
    ) => {
        socket?.emit(
            isPrivate ? 'diceAlienPrivateRequest' : 'diceAlienRequest',
            request
        );
    };

    const getDiceResultLog = useCallback(
        ({ isPrivate, aggregatedRolls, results, total }: DiceResponseBody) => {
            const parts: React.ReactNode[] = [
                t(
                    `page.play.event.${isPrivate ? 'dicePrivateResult' : 'diceResult'}`,
                    {
                        rolls: Object.entries(aggregatedRolls)
                            .map(([dType, dCount]) => `${dCount}${dType}`)
                            .join(', ')
                    }
                ).trim(),
                ' ',
                <span key="dice-total" style={{ fontWeight: 'bold' }}>
                    {total}
                </span>,
                results.length > 1
                    ? ` (${results.map(({ result }) => result).join(', ')})`
                    : ''
            ];
            return parts;
        },
        [t]
    );

    const getDiceAlienResultLog = useCallback(
        ({
            isPrivate,
            dices,
            stresses,
            successes,
            panics,
            results
        }: DiceAlienResponseBody) => {
            const rollText = t(
                `game.alien.dice.${isPrivate ? 'privateRoll' : 'roll'}`
            );
            const resultText = t('game.alien.dice.result');
            const detailText = t('game.alien.dice.detail');
            const dicesText = t(`game.alien.dice.dice${dices > 1 ? 's' : ''}`);
            const successesText = t(
                `game.alien.dice.success${successes > 1 ? 'es' : ''}`
            );
            let rollDetailText = `${dices} ${dicesText}`;
            if (stresses > 0) {
                rollDetailText += ` + ${stresses} ${t(
                    `game.alien.dice.stress${stresses > 1 ? 'es' : ''}`
                )}`;
            }
            const resultDetailParts: React.ReactNode[] = [
                <span key="alien-dice-successes" style={{ fontWeight: 'bold' }}>
                    {successes}
                </span>,
                ` ${successesText}`
            ];
            if (stresses > 0) {
                resultDetailParts.push(', ');
                resultDetailParts.push(
                    <span
                        key="alien-dice-panics"
                        style={{
                            fontWeight: 'bold',
                            color: 'var(--palette-yellow)'
                        }}
                    >
                        {panics}
                    </span>
                );
                const panicsText = t(
                    `game.alien.dice.panic${panics > 1 ? 's' : ''}`
                );
                resultDetailParts.push(` ${panicsText}`);
            }
            const resultsListParts: React.ReactNode[] = [];
            let idx = 0;
            for (const { result, stress } of results) {
                if (idx > 0) {
                    resultsListParts.push(', ');
                }
                if (stress) {
                    resultsListParts.push(
                        <span
                            key={`alien-dice-detail-${idx.toString()}`}
                            style={{
                                color: 'var(--palette-yellow)'
                            }}
                        >
                            {result}
                        </span>
                    );
                } else {
                    resultsListParts.push(result);
                }
                idx += 1;
            }
            const parts: React.ReactNode[] = [
                `${rollText} ${rollDetailText} ${resultText} `,
                ...resultDetailParts,
                ` (${detailText} : `,
                ...resultsListParts,
                ')'
            ];

            return parts;
        },
        [t]
    );

    return {
        requestDice,
        requestDiceAlien,
        getDiceResultLog,
        getDiceAlienResultLog
    };
};

export default useDice;
