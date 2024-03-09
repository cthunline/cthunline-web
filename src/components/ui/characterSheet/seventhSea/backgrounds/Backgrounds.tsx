import { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { SeventhSeaBackground } from '@cthunline/games';

import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import { GameId } from '../../../../../types';
import fields from '../fields.json';

const backgroundFields = fields.background as Field<SeventhSeaBackground>[];

interface BackgroundsProps {
    backgrounds: SeventhSeaBackground[];
    readonly: boolean;
    onChange: (index: number, data: SeventhSeaBackground) => void;
    onDelete: (index: number) => void;
}

const Backgrounds = ({
    backgrounds,
    readonly,
    onChange,
    onDelete
}: BackgroundsProps) => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns={`repeat(${readonly ? '11' : '12'}, 1fr)`}
        gap={2}
    >
        {backgrounds
            .map((background, index) => [
                <Box
                    key={`background-${index.toString()}-layout`}
                    gridColumn="span 11"
                    alignItems="center"
                >
                    <FieldLayout<SeventhSeaBackground>
                        gameId={GameId.seventhSea}
                        fields={backgroundFields}
                        textSectionKey="background"
                        data={background}
                        readonly={readonly}
                        onChange={(data) => onChange(index, data)}
                    />
                </Box>,
                readonly ? null : (
                    <Box
                        key={`background-${index.toString()}-delete`}
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

export default memo(Backgrounds);
