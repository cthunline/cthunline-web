import React from 'react';
import { Typography, Box, TextField } from '@mui/material';

import './SectionTitle.css';

interface SectionTitleProps {
    text: string;
    iconBefore?: JSX.Element;
    iconAfter?: JSX.Element;
    input?: SectionTitleInputOptions;
    gridColumn?: string;
    mb?: number;
    mt?: number;
}

interface SectionTitleInputOptions {
    value: any;
    readonly?: boolean;
    onChange?: (value: any) => void;
}

const SectionTitle = ({
    text,
    iconBefore,
    iconAfter,
    input,
    gridColumn,
    mb,
    mt
}: SectionTitleProps) => (
    <Typography
        className="section-title"
        variant="h6"
        gridColumn={gridColumn}
        mb={mb ?? 1}
        mt={mt ?? 1}
    >
        {iconBefore ? (
            <Box className="mr-5 section-title-icon" component="span">
                {iconBefore}
            </Box>
        ) : null}
        {text}
        {iconAfter ? (
            <Box className="ml-5 section-title-icon" component="span">
                {iconAfter}
            </Box>
        ) : null}
        {input ? (
            <Box className="ml-20" component="span">
                <TextField
                    className="section-title-input"
                    InputProps={{
                        readOnly: input.readonly,
                        classes: {
                            input: 'input-smaller-text'
                        }
                    }}
                    type="text"
                    size="small"
                    defaultValue={input.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (input.onChange) {
                            input.onChange(Number(e.target.value));
                        }
                    }}
                />
            </Box>
        ) : null}
    </Typography>
);

export default SectionTitle;
