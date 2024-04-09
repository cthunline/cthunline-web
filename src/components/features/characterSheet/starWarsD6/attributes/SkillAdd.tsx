import { type SWD6Attribute, type SWD6Skill } from '@cthunline/games';
import { ActionIcon, Box, Group } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import { useReducer, useMemo } from 'react';

import { skillList, defaultSkillData } from './skills.data.js';
import { useApp } from '../../../../contexts/App.js';
import AutocompleteInput, {
    type AutocompleteInputValue
} from '../../../../common/AutocompleteInput.js';

interface SkillProps {
    attribute: SWD6Attribute;
    onSubmit: (attribute: SWD6Attribute, data: SWD6Skill) => void;
}

type SkillAutocompleteInputValue = AutocompleteInputValue<SWD6Skill, 'name'>;

interface SkillAddData {
    autocompleteValue: SkillAutocompleteInputValue;
    data: SWD6Skill;
    error: boolean;
}

const defaultSkillAddData: SkillAddData = {
    autocompleteValue: {
        label: '',
        data: null
    },
    data: defaultSkillData,
    error: false
};

const SkillAdd = ({ attribute, onSubmit }: SkillProps) => {
    const { T } = useApp();

    const [skillAddData, updateSkillAddData] = useReducer(
        (
            prev: SkillAddData,
            updateData: Partial<SkillAddData>
        ): SkillAddData => {
            const updated: SkillAddData = {
                ...prev,
                ...updateData
            };
            if (!Object.hasOwn(updateData, 'error')) {
                if (updateData.data && !updateData.data.name) {
                    updated.error = true;
                } else if (!prev.data.name && updateData.data?.name) {
                    updated.error = false;
                }
            }
            return updated;
        },
        defaultSkillAddData
    );

    const skillOptions = useMemo(
        () =>
            skillList[attribute].map((textKey) => ({
                name: T(`game.starWarsD6.skill.${attribute}.${textKey}`),
                value: ''
            })),
        [attribute, T]
    );

    const controlForm = (): boolean => {
        const { name } = skillAddData.data;
        updateSkillAddData({
            error: !name
        });
        return !!name;
    };

    const onSkillInputChange = (value: SkillAutocompleteInputValue) => {
        const { label, data } = value;
        updateSkillAddData({
            autocompleteValue: value,
            data: data ?? {
                name: label,
                value: ''
            }
        });
    };

    return (
        <Group w="100%">
            <Box flex="1 0">
                <AutocompleteInput<SWD6Skill, 'name'>
                    variant="contained"
                    label={T('game.starWarsD6.common.skill')}
                    data={skillOptions}
                    field="name"
                    error={skillAddData.error}
                    value={skillAddData.autocompleteValue}
                    onChange={onSkillInputChange}
                />
            </Box>
            <ActionIcon
                onClick={() => {
                    if (controlForm()) {
                        onSubmit(attribute, {
                            ...defaultSkillData,
                            ...skillAddData.data
                        });
                        updateSkillAddData(defaultSkillAddData);
                    }
                }}
            >
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default SkillAdd;
