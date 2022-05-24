import React from 'react';
import { Typography } from '@mui/material';

interface SectionTitleProps {
    text: string;
    gridColumn?: string;
    mb?: number;
    mt?: number;
}

const SectionTitle = ({
    text,
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
        {text}
    </Typography>
);

export default SectionTitle;
