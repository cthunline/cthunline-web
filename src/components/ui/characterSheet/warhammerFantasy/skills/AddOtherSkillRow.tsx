import { type SelectChangeEvent, TextField, IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { FiPlusCircle } from 'react-icons/fi';
import { useMemo, useReducer } from 'react';
import {
    warhammerFantasy,
    type WarhammerFantasyOtherSkill,
    type WarhammerFantasyCharacteristicName,
    type WarhammerFantasyCharacter
} from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import Selector from '../../../selector/Selector';

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
                    name: T(
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
        <>
            <Grid xs={4} display="flex" alignItems="center">
                <TextField
                    fullWidth
                    InputProps={{
                        classes: {
                            input: 'input-smaller-text'
                        }
                    }}
                    label={T('game.warhammerFantasy.skill.name')}
                    type="text"
                    size="small"
                    value={otherSkillFormData.name}
                    error={otherSkillFormData.nameError}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateOtherSkillFormData({
                            name: e.target.value
                        });
                    }}
                />
            </Grid>
            <Grid xs={4} display="flex" alignItems="center">
                <Selector
                    size="small"
                    label={T('game.warhammerFantasy.common.characteristic')}
                    name="gameId"
                    options={characteristicNameOptions}
                    value={otherSkillFormData.characteristicName}
                    error={otherSkillFormData.characteristicNameError}
                    onChange={(e: SelectChangeEvent) => {
                        const name = e.target.value as
                            | WarhammerFantasyCharacteristicName
                            | '';
                        updateOtherSkillFormData({
                            characteristicName: name
                        });
                    }}
                />
            </Grid>
            <Grid
                xs={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <IconButton
                    size="medium"
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
                </IconButton>
            </Grid>
        </>
    );
};

export default AddOtherSkillRow;
