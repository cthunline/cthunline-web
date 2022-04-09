import React from 'react';
import { Typography } from '@mui/material';

interface SectionTitleProps {
    text: string;
    gridColumn?: string;
}

const SectionTitle = ({ text, gridColumn }: SectionTitleProps) => (
    <Typography
        variant="h6"
        gridColumn={gridColumn}
        mt={1}
        mb={1}
    >
        {text}
    </Typography>
);

export default SectionTitle;
