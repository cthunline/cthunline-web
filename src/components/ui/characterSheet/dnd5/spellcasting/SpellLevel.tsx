import React, { memo } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import { DnD5SpellLevel } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { spellLevelFields, defaultSpell } from './spellcasting.data';
import SpellList from './SpellList';

interface SpellLevelProps {
    spellLevel: DnD5SpellLevel;
    readonly: boolean;
    onChange: (data: DnD5SpellLevel) => void;
    isDelete: boolean;
    onDelete: () => void;
}

const SpellLevel: React.FC<SpellLevelProps> = ({
    spellLevel,
    readonly,
    onChange,
    isDelete,
    onDelete
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            alignItems="center"
            gap={2}
        >
            <Box key={`spellcasting-level-${spellLevel.level}-level`} gridColumn={`span ${readonly ? '8' : '7'}`}>
                {`${T('game.dnd5.spellcasting.level')} ${spellLevel.level}`}
                <Box component="span" className="ml-5">
                    <IconButton
                        size="small"
                        onClick={() => {
                            onChange({
                                ...spellLevel,
                                spells: [
                                    ...spellLevel.spells,
                                    { ...defaultSpell }
                                ]
                            });
                        }}
                    >
                        <FiPlusCircle />
                    </IconButton>
                </Box>
            </Box>
            {spellLevelFields.map((key) => {
                const value = spellLevel[key];
                return (
                    <Box key={`spellcasting-level-${spellLevel.level}-${key}`} gridColumn="span 2">
                        <TextField
                            fullWidth
                            InputProps={{
                                readOnly: readonly
                            }}
                            type="text"
                            size="small"
                            label={T(`game.dnd5.spellcasting.${key}`)}
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChange({
                                    ...spellLevel,
                                    [key]: Number(onlyNumbers(e.target.value))
                                });
                            }}
                        />
                    </Box>
                );
            })}
            {readonly ? null : (
                <Box
                    key={`spellcasting-level-${spellLevel.level}-delete`}
                    gridColumn="span 1"
                    alignItems="center"
                >
                    {isDelete ? (
                        <IconButton
                            size="medium"
                            color="error"
                            onClick={() => {
                                onDelete();
                            }}
                        >
                            <MdOutlineDeleteOutline />
                        </IconButton>
                    ) : null}
                </Box>
            )}
            <SpellList
                spells={spellLevel.spells}
                readonly={readonly}
                onChange={(spells) => {
                    onChange({
                        ...spellLevel,
                        spells
                    });
                }}
            />
        </Box>
    );
};

export default memo(SpellLevel);
