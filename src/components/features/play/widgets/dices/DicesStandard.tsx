import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    Stack,
    Tooltip
} from '@mantine/core';
import { useMemo, useReducer, useState } from 'react';
import {
    GiD4,
    GiD10,
    GiD12,
    GiDiceEightFacesEight,
    GiDiceSixFacesSix,
    GiDiceTwentyFacesTwenty
} from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import { diceTypes, diceValues } from '../../../../../services/dice.js';
import type {
    DiceAggregatedRolls,
    DiceRequestBody,
    DiceRequestRoll,
    DiceType
} from '../../../../../types/index.js';

const getDiceIcon = (
    type: DiceType,
    size: number | string
): React.ReactNode => {
    switch (type) {
        case 'D4':
            return <GiD4 size={size} />;
        case 'D6':
            return <GiDiceSixFacesSix size={size} />;
        case 'D8':
            return <GiDiceEightFacesEight size={size} />;
        case 'D10':
            return <GiD10 size={size} />;
        case 'D12':
            return <GiD12 size={size} />;
        case 'D20':
            return <GiDiceTwentyFacesTwenty size={size} />;
        case 'D100':
            return [
                <GiD10 size={size} key={`dice-${type}-1`} />,
                <GiD10 size={size} key={`dice-${type}-2`} />
            ];
        default:
            return null;
    }
};

interface DicesStandardProps {
    isMaster?: boolean;
    onRoll: (request: DiceRequestBody, isPrivate: boolean) => void;
}

type UpdateRollsOptions =
    | {
          action: 'add' | 'remove';
          dice: DiceType;
      }
    | {
          action: 'reset';
          dice?: never;
      };

const DicesStandard = ({ isMaster, onRoll }: DicesStandardProps) => {
    const { T } = useApp();

    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [rolls, updateRolls] = useReducer(
        (
            prev: DiceRequestRoll[],
            { dice, action }: UpdateRollsOptions
        ): DiceRequestRoll[] => {
            if (action === 'reset') {
                return [];
            }
            const next = [...prev];
            if (action === 'add') {
                next.push({ dice });
            } else if (action === 'remove') {
                const idx = next.findIndex(({ dice: d }) => d === dice);
                if (idx >= 0) {
                    next.splice(idx, 1);
                }
            }
            return next.toSorted(
                (a, b) =>
                    (diceValues.get(a.dice) ?? 0) -
                    (diceValues.get(b.dice) ?? 0)
            );
        },
        []
    );

    const [rollsDiceTypes, aggregatedRolls] = useMemo(() => {
        const dTypes: DiceType[] = [];
        const aggrRolls: DiceAggregatedRolls = {};
        for (const { dice } of rolls) {
            if (!aggrRolls[dice]) {
                dTypes.push(dice);
            }
            aggrRolls[dice] = (aggrRolls[dice] ?? 0) + 1;
        }
        return [dTypes, aggrRolls];
    }, [rolls]);

    const addRoll = (dice: DiceType) => {
        updateRolls({ action: 'add', dice });
    };

    const removeRoll = (dice: DiceType) => {
        updateRolls({ action: 'remove', dice });
    };

    const resetRolls = () => {
        updateRolls({ action: 'reset' });
        setIsPrivate(false);
    };

    const onSubmit = () => {
        onRoll({ rolls }, isPrivate);
        resetRolls();
    };

    return (
        <Stack w="100%" gap="1rem">
            <Group gap="0.5rem 2.5rem" my="0.25rem" justify="center">
                {diceTypes.map((type) => (
                    <Tooltip
                        key={`dice-${type}`}
                        label={type}
                        position="bottom"
                    >
                        <ActionIcon
                            key={`dice-item-${type}`}
                            variant="subtle"
                            h="3.5rem"
                            w="auto"
                            px="0.25rem"
                            onClick={() => addRoll(type)}
                        >
                            {getDiceIcon(type, '2.5rem')}
                        </ActionIcon>
                    </Tooltip>
                ))}
            </Group>
            <Group gap="0.25rem 1rem" justify="center">
                {rollsDiceTypes.map((type) => (
                    <Tooltip
                        key={`dice-selected-${type}`}
                        label={type}
                        position="bottom"
                    >
                        <ActionIcon
                            key={`dice-item-${type}`}
                            variant="subtle"
                            h="2.5em"
                            w="auto"
                            px="0.25rem"
                            fz="1.25rem"
                            color="red"
                            onClick={() => removeRoll(type)}
                        >
                            {`${aggregatedRolls[type]} x`}
                            &nbsp;
                            {getDiceIcon(type, '2rem')}
                        </ActionIcon>
                    </Tooltip>
                ))}
            </Group>
            {!!rollsDiceTypes.length && (
                <Stack align="center">
                    {!!isMaster && (
                        <Checkbox
                            label={T('common.private')}
                            labelPosition="left"
                            checked={isPrivate}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setIsPrivate(e.target.checked);
                            }}
                        />
                    )}
                    <Button onClick={onSubmit}>{T('action.roll')}</Button>
                </Stack>
            )}
        </Stack>
    );
};

export default DicesStandard;
