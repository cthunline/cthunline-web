import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { SeventhSeaAdvantage } from '@cthunline/games';

import { GameId } from '../../../../../types';
import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import fields from '../fields.json';

const advantageFields = fields.advantage as Field<SeventhSeaAdvantage>[];

interface AdvantagesProps {
    advantages: SeventhSeaAdvantage[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaAdvantage) => void;
    onDelete: (index: number) => void;
}

const Advantages: React.FC<AdvantagesProps> = ({
    advantages,
    readonly,
    onChange,
    onDelete
}) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns={`repeat(${readonly ? '11' : '12'}, 1fr)`}
        gap={2}
        rowGap={4}
    >
        {advantages
            .map((advantage, index) => [
                <Box
                    key={`advantage-${index.toString()}`}
                    gridColumn="span 11"
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    alignItems="center"
                    gap={2}
                >
                    <FieldLayout<SeventhSeaAdvantage>
                        gameId={GameId.seventhSea}
                        fields={advantageFields}
                        textSectionKey="advantage"
                        data={advantage}
                        readonly={readonly}
                        onChange={(data) =>
                            onChange(index, {
                                ...advantage,
                                ...data
                            })
                        }
                    />
                </Box>,
                readonly ? null : (
                    <Box
                        key={`advantage-${index.toString()}-delete`}
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
            ])
            .flat()}
    </Box>
);

export default memo(Advantages);
