import { Group, Stack } from '@mantine/core';
import {
    type SWD6Attributes,
    type SWD6Attribute,
    type SWD6AttributeData,
    type SWD6Skill
} from '@cthunline/games';

import Attribute from './Attribute';

interface AttributeProps {
    attributes: SWD6Attributes;
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

const Attributes = ({
    attributes,
    readonly,
    onChange,
    onSkillCreate,
    onSkillChange,
    onSkillDelete
}: AttributeProps) => {
    const attributeKeys = Object.keys(attributes) as SWD6Attribute[];
    const midIndex = Math.ceil(attributeKeys.length / 2 - 1);
    const firstColumnKeys = attributeKeys.slice(0, midIndex + 1);
    const secondColumnKeys = attributeKeys.slice(midIndex + 1);
    return (
        <Group w="100%">
            {[firstColumnKeys, secondColumnKeys].map((keys, idx) => (
                <Stack flex="1 0" key={`attribute-column-${idx.toString()}`}>
                    {keys.map((attribute) => (
                        <Attribute
                            key={`attribute-${attribute}`}
                            attribute={attribute}
                            data={attributes[attribute]}
                            readonly={readonly}
                            onChange={onChange}
                            onSkillCreate={onSkillCreate}
                            onSkillChange={onSkillChange}
                            onSkillDelete={onSkillDelete}
                        />
                    ))}
                </Stack>
            ))}
        </Group>
    );
};

export default Attributes;
