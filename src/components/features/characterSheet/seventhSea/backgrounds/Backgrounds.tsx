import { type SeventhSeaBackground } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';

import FieldLayout from '../../generic/fieldLayout/FieldLayout';
import { GameId } from '../../../../../types';
import { backgroundFields } from '../fields';

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
    <Stack w="100%" gap="1rem">
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
