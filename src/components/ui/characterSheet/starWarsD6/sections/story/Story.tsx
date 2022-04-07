import React, { memo } from 'react';
import {
    Box,
    TextField,
    Typography
} from '@mui/material';

import { SWD6Story } from '../../../../../../types/games/starWarsD6';
import { storyFields } from './story.data';

interface StoryProps {
    story: SWD6Story;
    readonly: boolean;
    onChange: (data: SWD6Story) => void;
}

const Story: React.FC<StoryProps> = ({
    story,
    readonly,
    onChange
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
    >
        {storyFields.map(({
            key,
            label,
            gridColumn,
            lines
        }) => (
            <Box
                key={`story-inner-${key}`}
                gridColumn={`span ${gridColumn}`}
                gap={2}
            >
                <Typography variant="h6">
                    {label}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    minRows={lines}
                    maxRows={lines}
                    value={key ? story[key] : ''}
                    InputProps={{
                        readOnly: readonly
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (key) {
                            onChange({
                                ...story,
                                [key]: e.target.value
                            });
                        }
                    }}
                />
            </Box>
        ))}
    </Box>
);

export default memo(Story);
