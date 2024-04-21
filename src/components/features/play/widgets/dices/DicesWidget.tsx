import { useState } from 'react';
import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    Stack,
    Tooltip
} from '@mantine/core';
import {
    GiD4,
    GiDiceSixFacesSix,
    GiDiceEightFacesEight,
    GiD10,
    GiD12,
    GiDiceTwentyFacesTwenty
} from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import Widget from '../../Widget.js';
import {
    WidgetType,
    type DiceType,
    type DicesData,
    type DicesRequest,
    diceTypes
} from '../../../../../types/index.js';

const defaultSelectedDices = Object.fromEntries(
    diceTypes.map((type) => [type, 0])
) as DicesData;

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

interface DicesWidgetProps {
    isMaster?: boolean;
    onRoll: (request: DicesRequest, isPrivate: boolean) => void;
    onClose: (widget: WidgetType) => void;
}

const DicesWidget = ({ isMaster, onRoll, onClose }: DicesWidgetProps) => {
    const { T } = useApp();

    const [selectedDices, setSelectedDices] =
        useState<DicesData>(defaultSelectedDices);
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const modifySelectedDice = (type: DiceType, modifier: number) => {
        setSelectedDices((previous) => ({
            ...previous,
            [type]: previous[type] + modifier
        }));
    };

    const resetSelectedDices = () => {
        setSelectedDices(defaultSelectedDices);
        setIsPrivate(false);
    };

    const selectedDiceTypes = diceTypes.filter(
        (type) => selectedDices[type] > 0
    );

    const onSubmit = () => {
        const request: DicesRequest = Object.fromEntries(
            selectedDiceTypes.map((type) => [type, selectedDices[type]])
        );
        onRoll(request, isPrivate);
        resetSelectedDices();
    };

    return (
        <Widget
            id={`widget-${WidgetType.dices}`}
            title={T('entity.dices')}
            onClose={() => onClose(WidgetType.dices)}
        >
            <Stack w="400px" gap="1rem">
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
                                onClick={() => modifySelectedDice(type, 1)}
                            >
                                {getDiceIcon(type, '2.5rem')}
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Group>
                <Group gap="0.25rem 1rem" justify="center">
                    {selectedDiceTypes.map((type) => (
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
                                onClick={() => modifySelectedDice(type, -1)}
                            >
                                {`${selectedDices[type]} x`}
                                &nbsp;
                                {getDiceIcon(type, '2rem')}
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Group>
                {!!selectedDiceTypes.length && (
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
        </Widget>
    );
};

export default DicesWidget;
