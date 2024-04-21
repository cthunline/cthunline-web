import { ActionIcon, Box, Group } from '@mantine/core';
import { FiPlusCircle } from 'react-icons/fi';
import { useMemo, useReducer } from 'react';
import {
    warhammerFantasy,
    type WarhammerFantasyOtherSkill,
    type WarhammerFantasyCharacteristicName,
    type WarhammerFantasyCharacter
} from '@cthunline/games';

import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';
import Select from '../../../../common/Select.js';

interface OtherSkillFormData {
    name: string;
    nameError: boolean;
    characteristicName: WarhammerFantasyCharacteristicName | '';
    characteristicNameError: boolean;
}

const defaultOtherSkillFormData: OtherSkillFormData = {
    name: '',
    nameError: false,
    characteristicName: '',
    characteristicNameError: false
};

interface AddOtherSkillRowProps {
    character: WarhammerFantasyCharacter;
    onCreate: (otherSkill: WarhammerFantasyOtherSkill) => void;
}

const AddOtherSkillRow = ({ character, onCreate }: AddOtherSkillRowProps) => {
    const { T } = useApp();

    const [otherSkillFormData, updateOtherSkillFormData] = useReducer(
        (
            prev: OtherSkillFormData,
            updateData: Partial<OtherSkillFormData> & { updateErrors?: boolean }
        ): OtherSkillFormData => {
            const { updateErrors, ...next } = updateData;
            const updated = { ...prev, ...next };
            if (updateErrors) {
                updated.nameError = !updated.name;
                updated.characteristicNameError = !updated.characteristicName;
            } else {
                if (updated.name) {
                    updated.nameError = false;
                }
                if (updated.characteristicName) {
                    updated.characteristicNameError = false;
                }
            }
            return updated;
        },
        defaultOtherSkillFormData
    );

    const characteristicNameOptions = useMemo(
        () =>
            warhammerFantasy.data.characteristicNames.map(
                (characteristicName) => ({
                    label: T(
                        `game.warhammerFantasy.characteristics.${characteristicName}.long`
                    ),
                    value: characteristicName
                })
            ),
        [T]
    );

    const resetForm = () => {
        updateOtherSkillFormData(defaultOtherSkillFormData);
    };

    return (
        <Group w="100%">
            <Box flex="1 0">
                <TextInput
                    variant="contained"
                    w="100%"
                    label={T('game.warhammerFantasy.skill.name')}
                    size="sm"
                    value={otherSkillFormData.name}
                    error={otherSkillFormData.nameError}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateOtherSkillFormData({
                            name: e.target.value
                        });
                    }}
                />
            </Box>
            <Box flex="1 0">
                <Select
                    variant="contained"
                    valueType="string"
                    label={T('game.warhammerFantasy.common.characteristic')}
                    name="gameId"
                    options={characteristicNameOptions}
                    value={otherSkillFormData.characteristicName}
                    error={otherSkillFormData.characteristicNameError}
                    onChange={(val: string | null) => {
                        if (val) {
                            updateOtherSkillFormData({
                                characteristicName:
                                    val as WarhammerFantasyCharacteristicName
                            });
                        }
                    }}
                />
            </Box>
            <ActionIcon
                onClick={() => {
                    const { name, characteristicName } = otherSkillFormData;
                    if (name && characteristicName) {
                        const characteristic =
                            character.characteristics[characteristicName];
                        onCreate({
                            name,
                            characteristicName,
                            advances: 0,
                            skill: characteristic.current
                        });
                        resetForm();
                    } else {
                        updateOtherSkillFormData({
                            updateErrors: true
                        });
                    }
                }}
            >
                <FiPlusCircle />
            </ActionIcon>
        </Group>
    );
};

export default AddOtherSkillRow;
