import { ActionIcon, Box, Group, Switch } from '@mantine/core';
import { type CoCSkill } from '@cthunline/games';
import { FiPlusCircle } from 'react-icons/fi';
import { useMemo, useReducer } from 'react';

import { type SkillData, skillList, defaultSkillValue } from './skills.data';
import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';
import AutocompleteInput, {
    type AutocompleteInputValue
} from '../../../../common/AutocompleteInput';

interface SkillAddProps {
    onSubmit: (data: CoCSkill) => void;
}

type SkillAutocompleteInputValue = AutocompleteInputValue<SkillData, 'name'>;

interface SkillAddDataErrors {
    name: boolean;
    base: boolean;
}

interface SkillAddData {
    autocompleteValue: SkillAutocompleteInputValue;
    data: SkillData;
    errors: SkillAddDataErrors;
}

type UpdateSkillAddData = Partial<{
    autocompleteValue: SkillAutocompleteInputValue;
    data: Partial<SkillData>;
    errors: Partial<SkillAddDataErrors>;
}>;

const defaultSkillAddData: SkillAddData = {
    autocompleteValue: {
        label: '',
        data: null
    },
    data: defaultSkillValue,
    errors: {
        name: false,
        base: false
    }
};

const SkillAdd = ({ onSubmit }: SkillAddProps) => {
    const { T } = useApp();

    const [skillAddData, updateSkillAddData] = useReducer(
        (prev: SkillAddData, updateData: UpdateSkillAddData): SkillAddData => {
            const updated: SkillAddData = {
                autocompleteValue: {
                    ...prev.autocompleteValue,
                    ...updateData.autocompleteValue
                },
                data: {
                    ...prev.data,
                    ...updateData.data
                },
                errors: {
                    ...prev.errors,
                    ...updateData.errors
                }
            };
            if (!updateData.errors) {
                (['name', 'base'] as const).forEach((field) => {
                    if (
                        updateData.data &&
                        Object.hasOwn(updateData.data, field) &&
                        !updateData.data[field]
                    ) {
                        updated.errors[field] = true;
                    } else if (!prev.data[field] && updateData.data?.[field]) {
                        updated.errors[field] = false;
                    }
                });
            }
            return updated;
        },
        defaultSkillAddData
    );

    const translatedSkillList: SkillData[] = useMemo(
        () =>
            skillList.map(({ key, base, development }) => ({
                name: T(`game.callOfCthulhu.skill.${key}`),
                base,
                development
            })),
        [T]
    );

    const controlForm = (): boolean => {
        const { name, base } = skillAddData.data;
        updateSkillAddData({
            errors: {
                name: !name,
                base: !base
            }
        });
        return !!name && !!base;
    };

    const onSkillInputChange = (value: SkillAutocompleteInputValue) => {
        const { label, data } = value;
        updateSkillAddData({
            autocompleteValue: value,
            data: data ?? {
                name: label
            }
        });
    };

    return (
        <Group w="100%" gap="0.5rem">
            <Box flex="8 0">
                <AutocompleteInput<SkillData, 'name'>
                    variant="contained"
                    label={T('game.callOfCthulhu.common.skill')}
                    data={translatedSkillList}
                    field="name"
                    error={skillAddData.errors.name}
                    value={skillAddData.autocompleteValue}
                    onChange={onSkillInputChange}
                />
            </Box>
            <Box flex="3 0">
                <TextInput
                    variant="contained"
                    w="100%"
                    size="sm"
                    label={T('game.callOfCthulhu.common.base')}
                    error={skillAddData.errors.base}
                    value={skillAddData.data.base}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateSkillAddData({
                            data: {
                                base: e.target.value
                            }
                        });
                    }}
                />
            </Box>
            <Box flex="5 0">
                <Switch
                    label={T('game.callOfCthulhu.common.development')}
                    labelPosition="left"
                    checked={skillAddData.data.development}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateSkillAddData({
                            data: {
                                development: e.target.checked
                            }
                        });
                    }}
                />
            </Box>
            <Box>
                <ActionIcon
                    onClick={() => {
                        if (controlForm()) {
                            onSubmit({
                                ...defaultSkillValue,
                                ...skillAddData.data,
                                developed: false,
                                regular: 0,
                                half: 0,
                                fifth: 0
                            });
                            updateSkillAddData(defaultSkillAddData);
                        }
                    }}
                >
                    <FiPlusCircle />
                </ActionIcon>
            </Box>
        </Group>
    );
};

export default SkillAdd;
