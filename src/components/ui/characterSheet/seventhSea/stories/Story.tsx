import { memo } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { SeventhSeaStory } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import { GameId } from '../../../../../types';
import fields from '../fields.json';

const storyFields = fields.story as Field<SeventhSeaStory>[];

interface StoryProps {
    index: number;
    story: SeventhSeaStory;
    readonly: boolean;
    onChange: (data: SeventhSeaStory) => void;
}

const Story = ({ index, story, readonly, onChange }: StoryProps) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 11"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
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
            <Box gridColumn="span 12">
                {T('game.seventhSea.story.steps')}
                {readonly ? null : (
                    <Box component="span" className="ml-5">
                        <IconButton
                            size="small"
                            onClick={() => {
                                onChange({
                                    ...story,
                                    steps: [...story.steps, '']
                                });
                            }}
                        >
                            <FiPlusCircle />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {story.steps.map((step, idx) => [
                <Box
                    key={`story-${index.toString()}-step-${idx.toString()}`}
                    gridColumn={`span ${readonly ? '12' : '11'}`}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={3}
                        InputProps={{
                            readOnly: readonly,
                            classes: {
                                input: 'input-smaller-text'
                            }
                        }}
                        type="text"
                        size="small"
                        label={(idx + 1).toString()}
                        value={step}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange({
                                ...story,
                                steps: story.steps.map((st, i) =>
                                    i === idx ? e.target.value : st
                                )
                            });
                        }}
                    />
                </Box>,
                readonly ? null : (
                    <Box
                        key={`story-${index.toString()}-step-${idx.toString()}-delete`}
                        gridColumn="span 1"
                        alignItems="center"
                    >
                        <IconButton
                            size="medium"
                            color="error"
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
                        </IconButton>
                    </Box>
                )
            ])}
        </Box>
    );
};

export default memo(Story);
