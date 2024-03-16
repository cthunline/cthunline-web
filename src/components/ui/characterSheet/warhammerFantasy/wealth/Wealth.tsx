import { Stack } from '@mui/material';
import { GiCash } from 'react-icons/gi';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyWealth
} from '@cthunline/games';

import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import { GameId } from '../../../../../types';
import fields from '../fields.json';

const wealthFields = fields.wealth as Field<WarhammerFantasyWealth>[];

export interface WealthProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (partialChar: Pick<WarhammerFantasyCharacter, 'wealth'>) => void;
    flex?: string | number;
}

const Wealth = ({ readonly, character, onChange, flex }: WealthProps) => {
    const { T } = useApp();
    return (
        <Stack direction="column" gap="0.5rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiCash size={20} />}
                text={T('game.warhammerFantasy.common.wealth')}
            />
            <FieldLayout<WarhammerFantasyWealth>
                gameId={GameId.warhammerFantasy}
                fields={wealthFields}
                textSectionKey="wealth"
                data={character.wealth}
                readonly={readonly}
                onChange={(wealth: WarhammerFantasyWealth) =>
                    onChange({ wealth })
                }
                rowGap={2}
                columnGap={0}
            />
        </Stack>
    );
};

export default Wealth;
