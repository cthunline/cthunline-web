import { GiCash } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyWealth
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import { GameId } from '../../../../../types/index.js';
import { useApp } from '../../../../contexts/App.js';
import { wealthFields } from '../fields.js';

export interface WealthProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (partialChar: Pick<WarhammerFantasyCharacter, 'wealth'>) => void;
    flex: string | number;
}

const Wealth = ({ readonly, character, onChange, flex }: WealthProps) => {
    const { T } = useApp();
    return (
        <Stack gap="1rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiCash size={20} />}
                text={T('game.warhammerFantasy.common.wealth')}
            />
            <FieldLayout<WarhammerFantasyWealth>
                gap="0.5rem"
                gameId={GameId.warhammerFantasy}
                fields={wealthFields}
                textSectionKey="wealth"
                data={character.wealth}
                readonly={readonly}
                onChange={(wealth: WarhammerFantasyWealth) =>
                    onChange({ wealth })
                }
            />
        </Stack>
    );
};

export default Wealth;
