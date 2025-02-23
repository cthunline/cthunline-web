import type { SeventhSeaAdvantage } from '@cthunline/games';
import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import { advantageFields } from '../fields.js';

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
    <Stack w="100%" gap="1.5rem">
        {advantages.map((advantage, index) => (
            <Group
                key={`advantage-${index.toString()}`}
                w="100%"
                gap="1rem"
                align="start"
            >
                <Box flex="1 0">
                    <FieldLayout<SeventhSeaAdvantage>
                        gameId="seventhSea"
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
