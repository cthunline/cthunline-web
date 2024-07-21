import type { DnD5Skills } from '@cthunline/games';
import { Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import ModifierRow from '../modifierRow/ModifierRow.js';

interface SkillsProps {
    skills: DnD5Skills;
    readonly: boolean;
    onChange: (data: Partial<DnD5Skills>) => void;
}

const Skills = ({ skills, readonly, onChange }: SkillsProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1rem">
            {(Object.keys(skills) as (keyof DnD5Skills)[]).map((skill) => {
                const data = skills[skill];
                return (
                    <ModifierRow
                        key={`skill-${skill}`}
                        readonly={readonly}
                        text={T(`game.dnd5.skill.${skill}`)}
                        proficient={data.proficient}
                        modifier={data.modifier}
                        onProficientChange={(checked) => {
                            onChange({
                                [skill]: {
                                    ...data,
                                    proficient: checked
                                }
                            });
                        }}
                    />
                );
            })}
        </Stack>
    );
};

export default Skills;
