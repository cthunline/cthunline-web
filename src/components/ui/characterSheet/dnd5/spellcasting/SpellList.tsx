import React, { memo } from 'react';
import { Box, TextField, Checkbox, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { DnD5Spell } from '@cthunline/games';

interface SpellListProps {
    spells: DnD5Spell[];
    readonly: boolean;
    onChange: (data: DnD5Spell[]) => void;
}

const SpellList: React.FC<SpellListProps> = ({
    spells,
    readonly,
    onChange
}) => (
    <>
        {spells.map(({ prepared, name }, index) => [
            <Box key={`spell-${index.toString}-prepared`} gridColumn="span 1">
                <Checkbox
                    checked={prepared}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!readonly) {
                            onChange(
                                spells.map((spell, idx) =>
                                    index === idx
                                        ? {
                                              ...spell,
                                              prepared: e.target.checked
                                          }
                                        : spell
                                )
                            );
                        }
                    }}
                />
            </Box>,
            <Box key={`spell-${index.toString}-name`} gridColumn="span 9">
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
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(
                            spells.map((spell, idx) =>
                                index === idx
                                    ? {
                                          ...spell,
                                          name: e.target.value
                                      }
                                    : spell
                            )
                        );
                    }}
                />
            </Box>,
            readonly ? null : (
                <Box
                    key={`spell-${index.toString}-delete`}
                    gridColumn="span 2"
                    alignItems="center"
                >
                    <IconButton
                        size="medium"
                        color="error"
                        onClick={() => {
                            onChange(spells.filter((_s, idx) => index !== idx));
                        }}
                    >
                        <MdOutlineDeleteOutline />
                    </IconButton>
                </Box>
            )
        ])}
    </>
);

export default memo(SpellList);
