import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { SeventhSeaStory } from '@cthunline/games';

import Story from './Story';

interface StoriesProps {
    stories: SeventhSeaStory[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaStory) => void;
    onDelete: (index: number) => void;
}

const Stories: React.FC<StoriesProps> = ({
    stories,
    readonly,
    onChange,
    onDelete
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns={`repeat(${readonly ? '11' : '12'}, 1fr)`}
        gap={2}
        rowGap={4}
    >
        {stories.map((story, index) => [
            <Story
                key={`story-${index.toString()}`}
                index={index}
                story={story}
                readonly={readonly}
                onChange={(data: SeventhSeaStory) => onChange(index, data)}
            />,
            readonly ? null : (
                <Box
                    key={`background-${index.toString()}-delete`}
                    gridColumn="span 1"
                    alignItems="center"
                >
                    <IconButton
                        size="medium"
                        color="error"
                        onClick={() => onDelete(index)}
                    >
                        <MdOutlineDeleteOutline />
                    </IconButton>
                </Box>
            )
        ]).flat()}
    </Box>
);

export default memo(Stories);
