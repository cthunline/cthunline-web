import React from 'react';
import { Typography, Box } from '@mui/material';

import './SectionTitle.css';

interface SectionTitleProps {
    text: string;
    iconBefore?: JSX.Element;
    iconAfter?: JSX.Element;
    gridColumn?: string;
    mb?: number;
    mt?: number;
}

const SectionTitle = ({
    text,
    iconBefore,
    iconAfter,
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
    </Typography>
);

export default SectionTitle;
