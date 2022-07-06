import React, { memo } from 'react';
import { Box, IconButton, Radio } from '@mui/material';
import { MdClose } from 'react-icons/md';

import './DeathSpiral.css';

interface DeathSpiralProps {
    value: number;
    readonly: boolean;
    onChange: (value: number) => void;
}

const DeathSpiral: React.FC<DeathSpiralProps> = ({
    value,
    readonly,
    onChange
}) => (
    <Box
        className="death-spiral"
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(26, 1fr)"
        alignItems="center"
    >
        {['radio', 'label'].map((rowType) => [
            ...[1, 2, 3, 4].map((sectionCount) => (
                [1, 2, 3, 4, 5].map((radioCount) => {
                    const radioVal = ((sectionCount - 1) * 5) + radioCount;
                    if (rowType === 'radio') {
                        return (
                            <Box
                                key={`deathSpiral-${radioVal.toString()}`}
                                className="death-spiral-radio-container"
                                gridColumn={`span ${radioCount === 5 ? '2' : '1'}`}
                                justifyContent="center"
                            >
                                <Radio
                                    className={`death-spiral-radio ${radioCount === 5 ? 'large' : ''}`}
                                    checked={value >= radioVal}
                                    value={radioVal}
                                    name="radio-buttons"
                                    onClick={(e) => {
                                        if (!readonly) {
                                            onChange(
                                                Number((e.target as HTMLInputElement).value)
                                            );
                                        }
                                    }}
                                />
                            </Box>
                        );
                    }
                    return (
                        <Box
                            key={`deathSpiral-label-${radioVal.toString()}`}
                            className="death-spiral-radio-label"
                            gridColumn={`span ${radioCount === 5 ? '2' : '1'}`}
                            justifyContent="center"
                        >
                            {radioCount === 5 ? sectionCount : null}
                        </Box>
                    );
                })
            )).flat(),
            rowType === 'radio' ? (
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
            ) : null
        ]).flat()}
    </Box>
);

export default memo(DeathSpiral);
