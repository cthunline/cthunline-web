import React from 'react';
import { Box, Typography } from '@mui/material';

import { CoCCharacterData } from '../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../characterSheetProps';
import Biography from './sections/Biography';
import Characteristics from './sections/Characteristics';

const CoCSheet: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        {/* biography */}
        <Box gridColumn="span 9" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Typography variant="h6" gridColumn="span 12">
                Biography
            </Typography>
            <Box gridColumn="span 12">
                <Biography
                    readonly={readonly}
                    data={data}
                    onChange={onChange}
                />
            </Box>
        </Box>
        {/* portrait */}
        <Box gridColumn="span 3" gridRow="span 2" style={{ background: 'grey' }} />
        {/* characteristics */}
        <Typography variant="h6" gridColumn="span 9">
            Characteristics
        </Typography>
        <Box gridColumn="span 12">
            <Characteristics
                readonly={readonly}
                data={data}
                onChange={onChange}
            />
        </Box>
    </Box>
);

export default CoCSheet;
