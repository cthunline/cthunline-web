import React, { memo } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';

import { useApp } from '../../../../contexts/App';

interface CantripsProps {
    cantrips: string[];
    readonly: boolean;
    onChange: (data: string[]) => void;
}

const Cantrips: React.FC<CantripsProps> = ({
    cantrips,
    readonly,
    onChange
}) => {
    const { T } = useApp();

    return (
        <>
            <Box gridColumn="span 3">
                {T('game.dnd5.spellcasting.cantrips')}
                {readonly ? null : (
                    <Box component="span" className="ml-5">
                        <IconButton
                            size="small"
                            onClick={() => {
                                onChange([...cantrips, '']);
                            }}
                        >
                            <FiPlusCircle />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {cantrips.map((cantrip, index) => [
                <Box
                    key={`cantrip-${index.toString}-name`}
                    gridColumn={`span ${readonly ? '11' : '10'}`}
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
                        value={cantrip}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                cantrips.map((cntrp, idx) =>
                                    index === idx ? e.target.value : cntrp
                                )
                            );
                        }}
                    />
                </Box>,
                readonly ? null : (
                    <Box
                        key={`cantrip-${index.toString}-delete`}
                        gridColumn="span 2"
                        alignItems="center"
                    >
                        <IconButton
                            size="medium"
                            color="error"
                            onClick={() => {
                                onChange(
                                    cantrips.filter((_c, idx) => index !== idx)
                                );
                            }}
                        >
                            <MdOutlineDeleteOutline />
                        </IconButton>
                    </Box>
                )
            ])}
        </>
    );
};

export default memo(Cantrips);
