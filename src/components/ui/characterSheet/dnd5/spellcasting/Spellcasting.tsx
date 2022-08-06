import React, { memo } from 'react';
import { Box, TextField } from '@mui/material';
import { DnD5Spellcasting } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { spellcastingFields } from './spellcasting.data';
import Cantrips from './Cantrips';
import SpellLevel from './SpellLevel';

interface SpellcastingProps {
    spellcasting: DnD5Spellcasting;
    readonly: boolean;
    onChange: (data: Partial<DnD5Spellcasting>) => void;
}

const Spellcasting: React.FC<SpellcastingProps> = ({
    spellcasting,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    const maxLevel = Math.max(0, ...spellcasting.levels.map((lvl) => lvl.level));

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
            {spellcastingFields.map(({ key, type, gridColumn }) => {
                const value = spellcasting[key];
                return [
                    <Box key={`spellcasting-${key}`} gridColumn={`span ${gridColumn}`}>
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
                            label={T(`game.dnd5.spellcasting.${key}`)}
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChange({
                                    ...spellcasting,
                                    [key]: type === 'number' ? (
                                        Number(onlyNumbers(e.target.value))
                                    ) : e.target.value
                                });
                            }}
                        />
                    </Box>
                ];
            })}
            <Cantrips
                cantrips={spellcasting.cantrips}
                readonly={readonly}
                onChange={(cantrips) => {
                    onChange({
                        ...spellcasting,
                        cantrips
                    });
                }}
            />
            {spellcasting.levels.map((spellLevel) => (
                <SpellLevel
                    key={`spellcasting-level-${spellLevel.level}`}
                    spellLevel={spellLevel}
                    readonly={readonly}
                    onChange={(data) => {
                        onChange({
                            ...spellcasting,
                            levels: spellcasting.levels.map((lvl) => (
                                lvl.level === data.level ? data : lvl
                            ))
                        });
                    }}
                    isDelete={spellLevel.level === maxLevel}
                    onDelete={() => {
                        const levelToDelete = spellLevel.level;
                        onChange({
                            ...spellcasting,
                            levels: spellcasting.levels.filter(({ level }) => (
                                level !== levelToDelete
                            ))
                        });
                    }}
                />
            ))}
        </Box>
    );
};

export default memo(Spellcasting);
