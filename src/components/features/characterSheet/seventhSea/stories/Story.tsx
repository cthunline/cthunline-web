import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type SeventhSeaStory } from '@cthunline/games';
import { FiPlusCircle } from 'react-icons/fi';
import { ActionIcon, Box, Group, Stack, type StackProps } from '@mantine/core';

import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import { GameId } from '../../../../../types/index.js';
import Textarea from '../../../../common/Textarea.js';
import { useApp } from '../../../../contexts/App.js';
import { storyFields } from '../fields.js';

interface StoryProps extends Pick<StackProps, 'flex'> {
    index: number;
    story: SeventhSeaStory;
    readonly: boolean;
    onChange: (data: SeventhSeaStory) => void;
}

const Story = ({ index, story, readonly, onChange }: StoryProps) => {
    const { T } = useApp();
    return (
        <Stack gap="1rem">
            <FieldLayout<SeventhSeaStory>
                gameId={GameId.seventhSea}
                fields={storyFields}
                textSectionKey="story"
                data={story}
                readonly={readonly}
                onChange={(data) =>
                    onChange({
                        ...story,
                        ...data
                    })
                }
            />
            <Group gap="1rem">
                {T('game.seventhSea.story.steps')}
                {!readonly && (
                    <Box component="span">
                        <ActionIcon
                            onClick={() => {
                                onChange({
                                    ...story,
                                    steps: [...story.steps, '']
                                });
                            }}
                        >
                            <FiPlusCircle />
                        </ActionIcon>
                    </Box>
                )}
            </Group>
            {story.steps.map((step, idx) => (
                <Group
                    key={`story-${index.toString()}-step-${idx.toString()}`}
                    w="100%"
                    gap="1rem"
                >
                    <Box flex="1 0">
                        <Textarea
                            variant="contained"
                            w="100%"
                            rows={3}
                            readOnly={readonly}
                            size="sm"
                            label={`${T('game.seventhSea.story.step')} ${(idx + 1).toString()}`}
                            value={step}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                                onChange({
                                    ...story,
                                    steps: story.steps.map((st, i) =>
                                        i === idx ? e.target.value : st
                                    )
                                });
                            }}
                        />
                    </Box>
                    {!readonly && (
                        <ActionIcon
                            color="red"
                            onClick={() => {
                                onChange({
                                    ...story,
                                    steps: story.steps.filter(
                                        (_st, i) => i !== idx
                                    )
                                });
                            }}
                        >
                            <MdOutlineDeleteOutline />
                        </ActionIcon>
                    )}
                </Group>
            ))}
        </Stack>
    );
};

export default Story;
