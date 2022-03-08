import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';

import { CoCStory } from '../../../../../../types/games/callOfCthulhu';
import { KeyData, storyKeys } from './story.data';

interface StoryProps {
    story: CoCStory;
    readonly: boolean;
    onChange: (data: CoCStory) => void;
}

const Story: React.FC<StoryProps> = ({
    story,
    readonly,
    onChange
}) => {
    const getInput = ({
        key,
        label,
        lines
    }: KeyData) => (
        <TextField
            label={label}
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
    );

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gap={2}
        >
            {storyKeys.map((keyData) => (
                keyData.children ? (
                    <Box
                        key={`story-${keyData.key}`}
                        gridColumn={`span ${keyData.gridColumn}`}
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap={2}
                    >
                        {keyData.children.map((childKeyData) => (
                            <Box
                                key={`story-inner-${childKeyData.key}`}
                                gridColumn={`span ${childKeyData.gridColumn}`}
                                gap={2}
                            >
                                {getInput(childKeyData)}
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        key={`story-inner-${keyData.key}`}
                        gridColumn={`span ${keyData.gridColumn}`}
                        gap={2}
                    >
                        {getInput(keyData)}
                    </Box>
                )
            ))}
        </Box>
    );
};

export default memo(Story);
