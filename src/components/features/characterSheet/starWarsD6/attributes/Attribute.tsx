import type {
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill
} from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import TextInput from '../../../../common/TextInput.js';
import Skill from './Skill.js';
import SkillAdd from './SkillAdd.js';

interface AttributeProps {
    attribute: SWD6Attribute;
    data: SWD6AttributeData;
    readonly: boolean;
    onChange: (attribute: SWD6Attribute, data: SWD6AttributeData) => void;
    onSkillCreate: (attribute: SWD6Attribute, data: SWD6Skill) => void;
    onSkillChange: (
        attribute: SWD6Attribute,
        index: number,
        data: SWD6Skill
    ) => void;
    onSkillDelete: (attribute: SWD6Attribute, index: number) => void;
}

const Attribute = ({
    attribute,
    data,
    readonly,
    onChange,
    onSkillCreate,
    onSkillChange,
    onSkillDelete
}: AttributeProps) => {
    const { T } = useApp();

    return (
        <Stack w="100%">
            <Group w="100%">
                <Box flex="2 0" fz="1.1rem" fw="bold">
                    {T(`game.starWarsD6.attribute.${attribute}`)}
                </Box>
                <Box flex="1 0">
                    <TextInput
                        w="100%"
                        readOnly={readonly}
                        size="sm"
                        value={data.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(attribute, {
                                ...data,
                                value: e.target.value
                            });
                        }}
                    />
                </Box>
            </Group>
            {data.skills.map((skill, index) => (
                <Skill
                    key={`skill-${attribute}-${index.toString()}`}
                    attribute={attribute}
                    index={index}
                    data={skill}
                    readonly={readonly}
                    onChange={onSkillChange}
                    onDelete={onSkillDelete}
                />
            ))}
            {!readonly && (
                <SkillAdd attribute={attribute} onSubmit={onSkillCreate} />
            )}
        </Stack>
    );
};

export default Attribute;
