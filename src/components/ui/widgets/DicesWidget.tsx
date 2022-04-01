import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import {
    GiD4,
    GiDiceSixFacesSix,
    GiDiceEightFacesEight,
    GiD10,
    GiD12,
    GiDiceTwentyFacesTwenty
} from 'react-icons/gi';

import Widget from '../play/Widget';
import {
    WidgetType,
    DiceType,
    DicesData,
    DicesRequest,
    diceTypes
} from '../../../types';

import './DicesWidget.css';

const defaultSelectedDices = (
    Object.fromEntries(diceTypes.map((type) => [type, 0])) as DicesData
);

const getDiceIcon = (
    type: DiceType,
    size: number
): JSX.Element | JSX.Element[] | null => {
    switch (type) {
        case 'D4': return <GiD4 size={size} />;
        case 'D6': return <GiDiceSixFacesSix size={size} />;
        case 'D8': return <GiDiceEightFacesEight size={size} />;
        case 'D10': return <GiD10 size={size} />;
        case 'D12': return <GiD12 size={size} />;
        case 'D20': return <GiDiceTwentyFacesTwenty size={size} />;
        case 'D100': return [
            <GiD10 size={size} key={`dice-${type}-1`} />,
            <GiD10 size={size} key={`dice-${type}-2`} />
        ];
        default: return null;
    }
};

interface DicesWidgetProps {
    isMaster?: boolean;
    onRoll: (request: DicesRequest, isPrivate: boolean) => void;
    onClose: (widget: WidgetType) => void;
}

const DicesWidget: React.FC<DicesWidgetProps> = ({
    isMaster,
    onRoll,
    onClose
}) => {
    const [selectedDices, setSelectedDices] = useState<DicesData>(
        defaultSelectedDices
    );
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

    const selectedDiceTypes = diceTypes.filter((type) => (
        selectedDices[type] > 0
    ));

    const onSubmit = () => {
        const request: DicesRequest = (
            Object.fromEntries(
                selectedDiceTypes.map((type) => (
                    [type, selectedDices[type]]
                ))
            )
        );
        onRoll(request, isPrivate);
        resetSelectedDices();
    };

    const getDiceList = () => (
        <Box
            className="dices-items"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {diceTypes.map((type) => (
                <Box
                    key={`dice-item-${type}`}
                    className="center-text"
                    gridColumn={`span ${type === 'D100' ? 6 : 3}`}
                >
                    <Box
                        className="clickable"
                        component="span"
                        onClick={() => modifySelectedDice(type, 1)}
                    >
                        {getDiceIcon(type, 50)}
                    </Box>
                </Box>
            ))}
        </Box>
    );

    const getSelectedDices = () => (
        <Box
            className="dices-selected"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {selectedDiceTypes.map((type) => (
                <Box
                    key={`dice-selected-${type}`}
                    className="dice-selected center-text"
                    gridColumn="span 4"
                >
                    <Box
                        className="flex center clickable"
                        onClick={() => modifySelectedDice(type, -1)}
                    >
                        <Box
                            className="dice-selected-multipler"
                            component="span"
                        >
                            {`${selectedDices[type]} x`}
                        </Box>
                        {getDiceIcon(type, 30)}
                    </Box>
                </Box>
            ))}
        </Box>
    );

    const getRollPrivateCheckbox = () => (
        isMaster ? (
            <FormControlLabel
                label="Private"
                labelPlacement="start"
                control={(
                    <Checkbox
                        checked={isPrivate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setIsPrivate(e.target.checked);
                        }}
                    />
                )}
            />
        ) : null
    );

    const getRollButton = () => (
        selectedDiceTypes.length ? (
            <Box className="flex column center">
                {getRollPrivateCheckbox()}
                <Button variant="contained" onClick={onSubmit}>
                    Roll
                </Button>
            </Box>
        ) : null
    );

    return (
        <Widget
            title="Dices"
            onClose={() => onClose(WidgetType.dices)}
        >
            <Box className="dices-widget-content">
                {getDiceList()}
                {getSelectedDices()}
                {getRollButton()}
            </Box>
        </Widget>
    );
};

export default DicesWidget;
