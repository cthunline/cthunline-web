import { memo } from 'react';
import { Box, TextField } from '@mui/material';
import { SWD6Attribute, SWD6AttributeData, SWD6Skill } from '@cthunline/games';

import Skill from './Skill';
import SkillAdd from './SkillAdd';
import { useApp } from '../../../../contexts/App';

import './Attribute.css';

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
        <Box
            gridColumn="span 6"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="start"
            rowGap={1}
            columnGap={2}
            gridAutoRows="min-content"
        >
            <Box
                gridColumn="span 12"
                display="grid"
                gridTemplateColumns="repeat(16, 1fr)"
                alignItems="center"
                rowGap={1}
                columnGap={2}
            >
                <Box className="attribute-name" gridColumn="span 11">
                    {T(`game.starWarsD6.attribute.${attribute}`)}
                </Box>
                <Box gridColumn="span 5">
                    <TextField
                        fullWidth
                        InputProps={{
                            readOnly: readonly,
                            classes: {
                                input: 'input-smaller-text'
                            }
                        }}
                        type="text"
                        size="small"
                        value={data.value}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(attribute, {
                                ...data,
                                value: e.target.value
                            });
                        }}
                    />
                </Box>
            </Box>
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
            {readonly ? null : (
                <SkillAdd attribute={attribute} onSubmit={onSkillCreate} />
            )}
        </Box>
    );
};

export default memo(Attribute);
