import React, { memo } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { DnD5Attack } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { attackFields } from './attacks.data';

interface AttacksProps {
    attacks: DnD5Attack[];
    readonly: boolean;
    onChange: (index: number, data: DnD5Attack) => void;
    onDelete: (index: number) => void;
}

const Attacks: React.FC<AttacksProps> = ({
    attacks,
    readonly,
    onChange,
    onDelete
}) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns={`repeat(${readonly ? '12' : '13'}, 1fr)`}
            gap={2}
        >
            {attacks.map((attack, index) => [
                ...attackFields.map(({ key, type, gridColumn }) => (
                    <Box
                        key={`attack-${index.toString()}-${key}`}
                        gridColumn={`span ${gridColumn}`}
                        alignItems="center"
                    >
                        <TextField
                            fullWidth
                            InputProps={{
                                readOnly: readonly
                            }}
                            type="text"
                            size="small"
                            label={T(`game.dnd5.attack.${key}`)}
                            value={attack[key]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChange(index, {
                                    ...attack,
                                    [key]: type === 'number' ? (
                                        Number(onlyNumbers(e.target.value))
                                    ) : e.target.value
                                });
                            }}
                        />
                    </Box>
                )),
                readonly ? null : (
                    <Box
                        key={`attack-${index.toString()}-delete`}
                        gridColumn="span 1"
                        alignItems="center"
                    >
                        <IconButton
                            size="medium"
                            color="error"
                            onClick={() => onDelete(index)}
                        >
                            <MdOutlineDeleteOutline />
                        </IconButton>
                    </Box>
                )
            ]).flat()}
        </Box>
    );
};

export default memo(Attacks);
