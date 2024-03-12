import { Box } from '@mui/material';
import { DnD5Skills } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import ModifierRow from '../modifierRow/ModifierRow';

interface SkillsProps {
    skills: DnD5Skills;
    readonly: boolean;
    onChange: (data: Partial<DnD5Skills>) => void;
}

const Skills = ({ skills, readonly, onChange }: SkillsProps) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
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
        </Box>
    );
};

export default Skills;
