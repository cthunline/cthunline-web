import React from 'react';
import { Typography, Box } from '@mui/material';

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
        variant="h6"
        gridColumn={gridColumn}
        mb={mb ?? 1}
        mt={mt ?? 1}
    >
        {iconBefore ? (
            <Box component="span" className="mr-5">{iconBefore}</Box>
        ) : null}
        {text}
        {iconAfter ? (
            <Box component="span" className="ml-5">{iconAfter}</Box>
        ) : null}
    </Typography>
);

export default SectionTitle;
