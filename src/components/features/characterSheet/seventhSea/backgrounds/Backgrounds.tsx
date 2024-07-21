import type { SeventhSeaBackground } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import { GameId } from '../../../../../types/index.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import { backgroundFields } from '../fields.js';

interface BackgroundsProps {
    backgrounds: SeventhSeaBackground[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaBackground) => void;
    onDelete: (index: number) => void;
}

const Backgrounds = ({
    backgrounds,
    readonly,
    onChange,
    onDelete
}: BackgroundsProps) => (
    <Stack w="100%" gap="1.5rem">
        {backgrounds.map((background, index) => (
            <Group key={`background-${index.toString()}`} w="100%" gap="1rem">
                <Box flex="1 0">
                    <FieldLayout<SeventhSeaBackground>
                        gameId={GameId.seventhSea}
                        fields={backgroundFields}
                        textSectionKey="background"
                        data={background}
                        readonly={readonly}
                        onChange={(data) => onChange(index, data)}
                    />
                </Box>
                {!readonly && (
                    <ActionIcon color="red" onClick={() => onDelete(index)}>
                        <MdOutlineDeleteOutline />
                    </ActionIcon>
                )}
            </Group>
        ))}
    </Stack>
);

export default Backgrounds;
