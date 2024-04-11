import { ActionIcon, Box, Group, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';

import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

interface CantripsProps {
    cantrips: string[];
    readonly: boolean;
    onChange: (data: string[]) => void;
}

const Cantrips = ({ cantrips, readonly, onChange }: CantripsProps) => {
    const { T } = useApp();

    return (
        <Stack w="100%" gap="1rem">
            <Group gap="1rem">
                {T('game.dnd5.spellcasting.cantrips')}
                {!readonly && (
                    <ActionIcon
                        onClick={() => {
                            onChange([...cantrips, '']);
                        }}
                    >
                        <FiPlusCircle />
                    </ActionIcon>
                )}
            </Group>
            {cantrips.map((cantrip, index) => [
                <Group key={`cantrip-${index.toString()}`} w="100%" gap="1rem">
                    <Box flex="1 0">
                        <TextInput
                            w="100%"
                            readOnly={readonly}
                            size="sm"
                            value={cantrip}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange(
                                    cantrips.map((cntrp, idx) =>
                                        index === idx ? e.target.value : cntrp
                                    )
                                );
                            }}
                        />
                    </Box>
                    {!readonly && (
                        <ActionIcon
                            color="red"
                            onClick={() => {
                                onChange(
                                    cantrips.filter((_c, idx) => index !== idx)
                                );
                            }}
                        >
                            <MdOutlineDeleteOutline />
                        </ActionIcon>
                    )}
                </Group>
            ])}
        </Stack>
    );
};

export default Cantrips;
