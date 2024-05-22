import { Box, Group } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBasicSkill,
    type WarhammerFantasyOtherSkill
} from '@cthunline/games';

import { type MoveAction } from '../../../../../services/tools.js';
import CareerLevelButton from '../generic/CareerLevelButton.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';
import { useApp } from '../../../../../contexts/App.js';
import RowInput from '../../generic/row/RowInput.js';

const isOtherSkill = (
    skill: WarhammerFantasyBasicSkill | WarhammerFantasyOtherSkill
): skill is WarhammerFantasyOtherSkill => Object.hasOwn(skill, 'name');

type SkillRowProps = {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onCareerLevelChange: (level: number | undefined) => void;
    onAdvancesChange: (advances: number) => void;
} & (
    | {
          skill: WarhammerFantasyBasicSkill;
          skillTranslatedName: string;
          onMove?: never;
          onDelete?: never;
      }
    | {
          skill: WarhammerFantasyOtherSkill;
          skillTranslatedName?: never;
          onMove: (action: MoveAction) => void;
          onDelete: () => void;
      }
);

const SkillRow = ({
    readonly,
    character,
    skill,
    skillTranslatedName,
    onMove,
    onDelete,
    onCareerLevelChange,
    onAdvancesChange
}: SkillRowProps) => {
    const { T } = useApp();
    const isOther = isOtherSkill(skill);
    return (
        <Group w="100%">
            <Group w="1.25rem">
                <CareerLevelButton
                    level={skill.careerLevel}
                    readonly={readonly}
                    onChange={onCareerLevelChange}
                />
            </Group>
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
                <RowInput
                    readonly={readonly}
                    type="number"
                    label={T('game.warhammerFantasy.skill.advances')}
                    value={skill.advances}
                    onChange={onAdvancesChange}
                />
            </Box>
            <Box flex="1 0">
                <RowInput
                    readonly
                    type="number"
                    label={T('game.warhammerFantasy.skill.skill')}
                    value={skill.skill}
                />
            </Box>
            {!readonly && !!onMove && !!onDelete && (
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default SkillRow;
