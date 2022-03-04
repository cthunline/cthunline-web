import React from 'react';
import { Box, Typography } from '@mui/material';

import { CoCCharacterData } from '../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../characterSheetProps';
import Biography from './sections/biography/Biography';
import Characteristics from './sections/characteristics/Characteristics';
import Status from './sections/status/Status';
import Skills from './sections/skills/Skills';

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
        {/* status */}
        <Typography variant="h6" gridColumn="span 12">
            Status
        </Typography>
        <Box gridColumn="span 12">
            <Status
                readonly={readonly}
                data={data}
                onChange={onChange}
            />
        </Box>
        {/* skills */}
        <Typography variant="h6" gridColumn="span 12">
            Skills
        </Typography>
        <Box gridColumn="span 12">
            <Skills
                readonly={readonly}
                data={data}
                onChange={onChange}
            />
        </Box>
    </Box>
);

export default CoCSheet;
