import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { type SeventhSeaAdvantage } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import FieldLayout from '../../generic/fieldLayout/FieldLayout';
import { GameId } from '../../../../../types';
import { advantageFields } from '../fields';

interface AdvantagesProps {
    advantages: SeventhSeaAdvantage[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaAdvantage) => void;
    onDelete: (index: number) => void;
}

const Advantages = ({
    advantages,
    readonly,
    onChange,
    onDelete
}: AdvantagesProps) => (
    <Stack w="100%" gap="1rem">
        {advantages.map((advantage, index) => (
            <Group
                key={`advantage-${index.toString()}`}
                w="100%"
                gap="1rem"
                align="start"
            >
                <Box flex="1 0">
                    <FieldLayout<SeventhSeaAdvantage>
                        gameId={GameId.seventhSea}
                        fields={advantageFields}
                        textSectionKey="advantage"
                        data={advantage}
                        readonly={readonly}
                        onChange={(data) =>
                            onChange(index, {
                                ...advantage,
                                ...data
                            })
                        }
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

export default Advantages;
