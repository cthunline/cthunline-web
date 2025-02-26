import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    Stack,
    Title,
    Tooltip
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { GiDiceSixFacesSix } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import type { DiceAlienRequestBody } from '../../../../../types/index.js';

type DicesAlienProps = {
    isMaster?: boolean;
    onRoll: (request: DiceAlienRequestBody, isPrivate: boolean) => void;
};

const defaultRoll: DiceAlienRequestBody = {
    dices: 0,
    stresses: 0
};

type AlienDiceType = {
    label: string;
    color?: string;
    type: keyof DiceAlienRequestBody;
};

const DicesAlien = ({ isMaster, onRoll }: DicesAlienProps) => {
    const T = useLocaleStore(({ T }) => T);

    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [roll, setRoll] = useState<DiceAlienRequestBody>(defaultRoll);

    const addRoll = (type: keyof DiceAlienRequestBody) => {
        setRoll((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const removeRoll = (type: keyof DiceAlienRequestBody) => {
        setRoll((prev) => ({
            ...prev,
            [type]: prev[type] > 0 ? prev[type] - 1 : 0
        }));
    };

    const resetRoll = () => {
        setRoll(defaultRoll);
        setIsPrivate(false);
    };

    const onSubmit = () => {
        onRoll(roll, isPrivate);
        resetRoll();
    };

    const diceTypes: AlienDiceType[] = useMemo(
        () =>
            [
                {
                    label: T('game.alien.dice.dice'),
                    type: 'dices'
                },
                {
                    label: T('game.alien.dice.stress'),
                    type: 'stresses',
                    color: 'var(--palette-yellow)'
                }
            ] satisfies AlienDiceType[],
        [T]
    );

    const isDices = roll.dices > 0 || roll.stresses > 0;
    const canRoll = roll.dices > 0;

    return (
        <Stack w="100%" gap="1rem">
            <Group gap="0.5rem 2.5rem" my="0.25rem" justify="center">
                {diceTypes.map(({ label, type, color }) => (
                    <Tooltip
                        key={`dices-alien-${type}`}
                        label={label}
                        position="bottom"
                    >
                        <ActionIcon
                            variant="subtle"
                            h="3.5rem"
                            w="auto"
                            px="0.25rem"
                            onClick={() => addRoll(type)}
                            color={color}
                        >
                            <GiDiceSixFacesSix size="2.5rem" />
                        </ActionIcon>
                    </Tooltip>
                ))}
            </Group>
            {isDices && (
                <Stack w="100%" align="center" gap="1rem">
                    <Title order={4}>{`${T('widget.dice.roll')} : `}</Title>
                    <Group gap="0.25rem 1rem" justify="center">
                        {diceTypes.map(
                            ({ label, type, color }) =>
                                roll[type] > 0 && (
                                    <Tooltip
                                        key={`dices-alien-roll-${type}`}
                                        label={label}
                                        position="bottom"
                                    >
                                        <ActionIcon
                                            key={`dice-item-${type}`}
                                            variant="subtle"
                                            h="2.5em"
                                            w="auto"
                                            px="0.25rem"
                                            fz="1.25rem"
                                            color={color}
                                            onClick={() => removeRoll(type)}
                                        >
                                            {`${roll[type]} x`}
                                            &nbsp;
                                            <GiDiceSixFacesSix size="2.5rem" />
                                        </ActionIcon>
                                    </Tooltip>
                                )
                        )}
                    </Group>
                    {canRoll && (
                        <>
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
                            <Button onClick={onSubmit}>
                                {T('action.roll')}
                            </Button>
                        </>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

export default DicesAlien;
