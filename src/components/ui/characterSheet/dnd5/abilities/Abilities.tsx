import { Box, TextField } from '@mui/material';
import { DnD5Abilities } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { displayModifier, calculateAbility } from '../dnd5Sheet.helper';

interface AbilitiesProps {
    abilities: DnD5Abilities;
    readonly: boolean;
    onChange: (data: Partial<DnD5Abilities>) => void;
}

const Abilities = ({ abilities, readonly, onChange }: AbilitiesProps) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
            {(Object.keys(abilities) as (keyof DnD5Abilities)[]).map(
                (ability) => {
                    const data = abilities[ability];
                    return [
                        <Box
                            key={`ability-${ability}-label`}
                            gridColumn="span 6"
                        >
                            {T(`game.dnd5.ability.${ability}`)}
                        </Box>,
                        <Box
                            key={`ability-${ability}-score`}
                            gridColumn="span 3"
                        >
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: readonly,
                                    classes: {
                                        input: 'input-smaller-text'
                                    }
                                }}
                                type="text"
                                size="small"
                                label={T('game.dnd5.common.score')}
                                value={data.score}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChange({
                                        [ability]: calculateAbility({
                                            ...data,
                                            score: Number(
                                                onlyNumbers(e.target.value)
                                            )
                                        })
                                    });
                                }}
                            />
                        </Box>,
                        <Box
                            key={`ability-${ability}-modifier`}
                            gridColumn="span 3"
                        >
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                    classes: {
                                        input: 'input-smaller-text'
                                    }
                                }}
                                type="text"
                                size="small"
                                label={T('game.dnd5.common.modifier')}
                                value={displayModifier(data.modifier)}
                            />
                        </Box>
                    ];
                }
            )}
        </Box>
    );
};

export default Abilities;
