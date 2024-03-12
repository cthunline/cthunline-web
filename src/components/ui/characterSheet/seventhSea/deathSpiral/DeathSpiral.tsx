import { Box, IconButton, Radio } from '@mui/material';
import { MdClose } from 'react-icons/md';

import './DeathSpiral.css';

interface DeathSpiralProps {
    value: number;
    readonly: boolean;
    onChange: (value: number) => void;
}

const DeathSpiral = ({ value, readonly, onChange }: DeathSpiralProps) => {
    const getRadioButton = (radioCount: number, radioValue: number) => (
        <Box
            key={`deathSpiral-${radioValue.toString()}`}
            className="death-spiral-radio-container"
            gridColumn={`span ${radioCount === 5 ? '2' : '1'}`}
            justifyContent="center"
        >
            <Radio
                className={`death-spiral-radio ${
                    radioCount === 5 ? 'large' : ''
                }`}
                checked={value >= radioValue}
                value={radioValue}
                name="radio-buttons"
                onClick={(e) => {
                    if (!readonly) {
                        onChange(Number((e.target as HTMLInputElement).value));
                    }
                }}
            />
        </Box>
    );

    const getLabel = (sectionCount: number, radioCount: number) => (
        <Box
            key={`deathSpiral-label-${sectionCount.toString()}-${radioCount.toString()}`}
            className="death-spiral-radio-label"
            gridColumn={`span ${radioCount === 5 ? '2' : '1'}`}
            justifyContent="center"
        >
            {radioCount === 5 ? sectionCount : null}
        </Box>
    );

    const getClearButton = () => (
        <Box
            key="deathSpiral-clear"
            className="death-spiral-clear-container"
            gridColumn="span 2"
            justifyContent="center"
        >
            {readonly ? null : (
                <IconButton
                    className="ml-5 death-spiral-clear"
                    size="small"
                    color="error"
                    onClick={() => {
                        onChange(0);
                    }}
                >
                    <MdClose size={20} />
                </IconButton>
            )}
        </Box>
    );

    return (
        <Box
            className="death-spiral"
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(26, 1fr)"
            alignItems="center"
        >
            {['radio', 'label']
                .map((rowType) => [
                    ...[1, 2, 3, 4]
                        .map((sectionCount) =>
                            [1, 2, 3, 4, 5].map((radioCount) => {
                                const radioValue =
                                    (sectionCount - 1) * 5 + radioCount;
                                if (rowType === 'radio') {
                                    return getRadioButton(
                                        radioCount,
                                        radioValue
                                    );
                                }
                                return getLabel(sectionCount, radioCount);
                            })
                        )
                        .flat(),
                    rowType === 'radio' ? getClearButton() : null
                ])
                .flat()}
        </Box>
    );
};

export default DeathSpiral;
