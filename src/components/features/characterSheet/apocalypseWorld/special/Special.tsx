import type { ApocalypseWorldCharacter } from '@cthunline/games';
import { Stack, Text } from '@mantine/core';
import { GiCharm } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

interface SpecialProps {
    character: ApocalypseWorldCharacter;
}

const Special = ({ character }: SpecialProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiCharm size={20} />}
                text={T('game.apocalypseWorld.special')}
            />
            <Text fz="0.875rem" style={{ whiteSpace: 'pre-line' }}>
                {T(
                    `game.apocalypseWorld.playbooks.${character.playbook}.special`
                )}
            </Text>
        </Stack>
    );
};

export default Special;
