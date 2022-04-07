import React, { memo } from 'react';
import { Box } from '@mui/material';

import Attribute from './Attribute';
import {
    SWD6Attributes,
    SWD6Attribute,
    SWD6AttributeData,
    SWD6Skill
} from '../../../../../../types/games/starWarsD6';

import './Attribute.css';

interface AttributeProps {
    attributes: SWD6Attributes;
    readonly: boolean;
    onChange: (attribute: SWD6Attribute, data: SWD6AttributeData) => void;
    onSkillCreate: (attribute: SWD6Attribute, data: SWD6Skill) => void;
    onSkillChange: (attribute: SWD6Attribute, index: number, data: SWD6Skill) => void;
    onSkillDelete: (attribute: SWD6Attribute, index: number) => void;
}

const Attributes: React.FC<AttributeProps> = ({
    attributes,
    readonly,
    onChange,
    onSkillCreate,
    onSkillChange,
    onSkillDelete
}) => (
    <Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
        {(Object.keys(attributes) as SWD6Attribute[]).map((attribute) => (
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
    </Box>
);

export default memo(Attributes);
