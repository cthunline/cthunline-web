import type { SWD6Attribute, SWD6Skill } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';

import TextInput from '../../../../common/TextInput.js';
import { skillFields } from './skills.data.js';

interface SkillProps {
    attribute: SWD6Attribute;
    index: number;
    data: SWD6Skill;
    readonly: boolean;
    onChange: (
        attribute: SWD6Attribute,
        index: number,
        data: SWD6Skill
    ) => void;
    onDelete: (attribute: SWD6Attribute, index: number) => void;
}

const Skill = ({
    attribute,
    index,
    data,
    readonly,
    onChange,
    onDelete
}: SkillProps) => (
    <Group w="100%">
        {skillFields.map(({ gridColumn, key }) => (
            <Box key={`skill-${key}`} flex={`${gridColumn} 0`}>
                <TextInput
                    w="100%"
                    readOnly={readonly}
                    size="sm"
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(attribute, index, {
                            ...data,
                            [key]: e.target.value
                        });
                    }}
                />
            </Box>
        ))}
        {!readonly && (
            <ActionIcon color="red" onClick={() => onDelete(attribute, index)}>
                <MdOutlineDeleteOutline />
            </ActionIcon>
        )}
    </Group>
);

export default Skill;
