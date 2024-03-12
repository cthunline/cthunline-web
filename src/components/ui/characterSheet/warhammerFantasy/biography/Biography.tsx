import { Stack, type StackProps } from '@mui/material';
import { GiCharacter } from 'react-icons/gi';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyBiography
} from '@cthunline/games';

import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import { GameId } from '../../../../../types';
import fields from '../fields.json';

const biographyFields = fields.biography as Field<WarhammerFantasyBiography>[];

export interface BiographyProps
    extends Omit<StackProps, 'onChange' | 'readonly'> {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (bio: Pick<WarhammerFantasyCharacter, 'biography'>) => void;
}

const Biography = ({
    readonly,
    character,
    onChange,
    ...props
}: BiographyProps) => {
    const { T } = useApp();
    return (
        <Stack direction="column" gap="0.5rem" {...props}>
            <SectionTitle
                iconBefore={<GiCharacter size={20} />}
                text={T('game.warhammerFantasy.biography.biography')}
            />
            <FieldLayout<WarhammerFantasyBiography>
                gameId={GameId.warhammerFantasy}
                fields={biographyFields}
                textSectionKey="biography"
                data={character.biography}
                readonly={readonly}
                onChange={(biography: WarhammerFantasyBiography) =>
                    onChange({ biography })
                }
            />
        </Stack>
    );
};

export default Biography;
