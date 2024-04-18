import { GiJuggler } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyOtherSkill
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddOtherSkillRow from './AddOtherSkillRow.js';
import { useApp } from '../../../../contexts/App.js';
import SkillRow from './SkillRow.js';
import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';

interface OtherSkillsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        otherSkills: Pick<WarhammerFantasyCharacter, 'otherSkills'>
    ) => void;
}

const OtherSkills = ({ readonly, character, onChange }: OtherSkillsProps) => {
    const { T } = useApp();

    const onOtherSkillCareerLevelChange = (
        index: number,
        careerLevel: number | undefined
    ) => {
        const otherSkills = [...character.otherSkills];
        const otherSkill = otherSkills[index];
        if (otherSkill) {
            otherSkills[index] = {
                ...otherSkill,
                careerLevel
            };
            onChange({ otherSkills });
        }
    };

    const onOtherSkillAdvancesChange = (index: number, advances: number) => {
        const otherSkills = [...character.otherSkills];
        const otherSkill = otherSkills[index];
        if (otherSkill) {
            const char =
                character.characteristics[otherSkill.characteristicName];
            otherSkills[index] = {
                ...otherSkill,
                advances,
                skill: char.current + advances
            };
            onChange({ otherSkills });
        }
    };

    const onCreateOtherSkill = (otherSkill: WarhammerFantasyOtherSkill) => {
        onChange({
            otherSkills: [...character.otherSkills, otherSkill]
        });
    };

    const onOtherSkillMove = (index: number, action: MoveAction) => {
        const movedOtherSkills = arrayMoveUpDown(
            character.otherSkills,
            index,
            action
        );
        if (movedOtherSkills) {
            onChange({
                otherSkills: movedOtherSkills
            });
        }
    };

    const onOtherSkillDelete = (index: number) => {
        onChange({
            otherSkills: character.otherSkills.filter(
                (_otherSkill, idx) => index !== idx
            )
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiJuggler size={20} />}
                text={T('game.warhammerFantasy.common.otherSkills')}
            />
            <Stack gap="1rem" w="100%">
                {character.otherSkills.map((otherSkill, index) => (
                    <SkillRow
                        key={`otherSkill-row-${index.toString()}`}
                        readonly={readonly}
                        character={character}
                        skill={otherSkill}
                        onCareerLevelChange={(level: number | undefined) => {
                            onOtherSkillCareerLevelChange(index, level);
                        }}
                        onAdvancesChange={(val: number) => {
                            onOtherSkillAdvancesChange(index, val);
                        }}
                        onMove={(action) => {
                            onOtherSkillMove(index, action);
                        }}
                        onDelete={() => {
                            onOtherSkillDelete(index);
                        }}
                    />
                ))}
                {!readonly && (
                    <AddOtherSkillRow
                        character={character}
                        onCreate={onCreateOtherSkill}
                    />
                )}
            </Stack>
        </Stack>
    );
};

export default OtherSkills;
