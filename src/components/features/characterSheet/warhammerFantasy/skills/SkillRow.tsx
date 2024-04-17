import { MdOutlineDeleteOutline } from 'react-icons/md';
import { ActionIcon, Box, Group } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkill,
    type WarhammerFantasyOtherSkill
} from '@cthunline/games';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

interface SkillRowInputProps {
    readonly: boolean;
    label?: string;
    value: number;
    onChange?: (value: number) => void;
}

const SkillRowInput = ({
    readonly,
    label,
    value,
    onChange
}: SkillRowInputProps) => (
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        center
        size="sm"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(Number(onlyNumbers(e.target.value)));
        }}
    />
);

const isOtherSkill = (
    skill: WarhammerFantasyBasicSkill | WarhammerFantasyOtherSkill
): skill is WarhammerFantasyOtherSkill => Object.hasOwn(skill, 'name');

type SkillRowProps = {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onAdvancesChange: (advances: number) => void;
} & (
    | {
          skill: WarhammerFantasyBasicSkill;
          skillTranslatedName: string;
          onDelete?: never;
      }
    | {
          skill: WarhammerFantasyOtherSkill;
          skillTranslatedName?: never;
          onDelete: () => void;
      }
);

const SkillRow = ({
    readonly,
    character,
    skill,
    skillTranslatedName,
    onDelete,
    onAdvancesChange
}: SkillRowProps) => {
    const { T } = useApp();
    const isOther = isOtherSkill(skill);
    return (
        <Group w="100%">
            <Box flex="4 0">{isOther ? skill.name : skillTranslatedName}</Box>
            <Box flex="1 0">
                {T(
                    `game.warhammerFantasy.characteristics.${skill.characteristicName}.short`
                )}
            </Box>
            <Box flex="1 0">
                {character.characteristics[skill.characteristicName].current}
            </Box>
            <Box flex="1 0">
                <SkillRowInput
                    readonly={readonly}
                    label={T('game.warhammerFantasy.skill.advances')}
                    value={skill.advances}
                    onChange={onAdvancesChange}
                />
            </Box>
            <Box flex="1 0">
                <SkillRowInput
                    readonly
                    label={T('game.warhammerFantasy.skill.skill')}
                    value={skill.skill}
                />
            </Box>
            {!readonly && !!onDelete && (
                <ActionIcon color="red" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default SkillRow;
