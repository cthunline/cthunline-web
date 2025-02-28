import type {
    WarhammerFantasyCharacter,
    WarhammerFantasyWealth
} from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { GiCash } from 'react-icons/gi';
import { useShallow } from 'zustand/react/shallow';

import { useLocaleStore } from '../../../../../stores/locale.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { wealthFields } from '../fields.js';

export interface WealthProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (partialChar: Pick<WarhammerFantasyCharacter, 'wealth'>) => void;
    flex: string | number;
}

const Wealth = ({ readonly, character, onChange, flex }: WealthProps) => {
    const { T, TU } = useLocaleStore(useShallow(({ T, TU }) => ({ T, TU })));

    const [P, S, GC] = useMemo(
        () => [
            TU('game.warhammerFantasy.wealth.short.brassPennies'),
            TU('game.warhammerFantasy.wealth.short.silverShillings'),
            TU('game.warhammerFantasy.wealth.short.goldCrowns')
        ],
        [TU]
    );

    return (
        <Stack gap="1rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiCash size={20} />}
                text={T('game.warhammerFantasy.common.wealth')}
            />
            <Group w="100%" gap="1rem">
                <Box flex="6 0">
                    <FieldLayout<WarhammerFantasyWealth>
                        gap="0.5rem"
                        gameId="warhammerFantasy"
                        fields={wealthFields}
                        textSectionKey="wealth"
                        data={character.wealth}
                        readonly={readonly}
                        onChange={(wealth: WarhammerFantasyWealth) =>
                            onChange({ wealth })
                        }
                    />
                </Box>
                <Stack flex="5 0" gap="0.5rem">
                    <Box h="2.25rem" />
                    <Group h="2.25rem" fz="0.8rem" align="center">
                        {`1 ${S} = 12 ${P}`}
                    </Group>
                    <Group h="2.25rem" fz="0.8rem" align="center">
                        {`1 ${GC} = 20 ${S}`}
                    </Group>
                </Stack>
            </Group>
        </Stack>
    );
};

export default Wealth;
