import { type DnD5SavingThrows, type DnD5Abilities } from '@cthunline/games';
import { Stack } from '@mantine/core';

import ModifierRow from '../modifierRow/ModifierRow';
import { useApp } from '../../../../contexts/App';

interface SavingThrowsProps {
    savingThrows: DnD5SavingThrows;
    readonly: boolean;
    onChange: (data: Partial<DnD5SavingThrows>) => void;
}

const SavingThrows = ({
    savingThrows,
    readonly,
    onChange
}: SavingThrowsProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1rem">
            {(Object.keys(savingThrows) as (keyof DnD5Abilities)[]).map(
                (ability) => {
                    const data = savingThrows[ability];
                    return (
                        <ModifierRow
                            key={`savingThrow-${ability}`}
                            readonly={readonly}
                            text={T(`game.dnd5.ability.${ability}`)}
                            proficient={data.proficient}
                            modifier={data.modifier}
                            onProficientChange={(checked) => {
                                onChange({
                                    [ability]: {
                                        ...data,
                                        proficient: checked
                                    }
                                });
                            }}
                        />
                    );
                }
            )}
        </Stack>
    );
};

export default SavingThrows;
