import { Button, Checkbox, Group, Stack, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import {
    GiD4,
    GiDiceSixFacesSix,
    GiDiceEightFacesEight,
    GiD10,
    GiD12,
    GiDiceTwentyFacesTwenty
} from 'react-icons/gi';

import { useApp } from '../../../../contexts/App';
import Widget from '../../Widget';
import {
    WidgetType,
    type DiceType,
    type DicesData,
    type DicesRequest,
    diceTypes
} from '../../../../../types';

const defaultSelectedDices = Object.fromEntries(
    diceTypes.map((type) => [type, 0])
) as DicesData;

const getDiceIcon = (type: DiceType, size: number): React.ReactNode => {
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
                <Group gap="0.5rem">
                    {diceTypes.map((type) => (
                        <UnstyledButton
                            key={`dice-item-${type}`}
                            onClick={() => modifySelectedDice(type, 1)}
                        >
                            {getDiceIcon(type, 50)}
                        </UnstyledButton>
                    ))}
                </Group>
                <Group>
                    {selectedDiceTypes.map((type) => (
                        <UnstyledButton
                            key={`dice-selected-${type}`}
                            onClick={() => modifySelectedDice(type, -1)}
                        >
                            {`${selectedDices[type]} x `}
                            {getDiceIcon(type, 30)}
                        </UnstyledButton>
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
