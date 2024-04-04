import { ActionIcon, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type SeventhSeaStory } from '@cthunline/games';

import Story from './Story';

interface StoriesProps {
    stories: SeventhSeaStory[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaStory) => void;
    onDelete: (index: number) => void;
}

const Stories = ({ stories, readonly, onChange, onDelete }: StoriesProps) => (
    <Stack w="100%" gap="1rem">
        {stories.map((story, index) => (
            <Group
                key={`story-${index.toString()}`}
                align="start"
                w="100%"
                gap="1rem"
            >
                <Story
                    flex="1 0"
                    index={index}
                    story={story}
                    readonly={readonly}
                    onChange={(data: SeventhSeaStory) => onChange(index, data)}
                />
                {!readonly && (
                    <ActionIcon color="red" onClick={() => onDelete(index)}>
                        <MdOutlineDeleteOutline />
                    </ActionIcon>
                )}
            </Group>
        ))}
    </Stack>
);

export default Stories;
