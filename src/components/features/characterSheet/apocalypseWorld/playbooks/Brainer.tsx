import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiCeremonialMask } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';

interface BrainerProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'brainer'>) => void;
}

const Brainer = ({ readonly, character, onChange }: BrainerProps) => {
    const T = useLocaleStore(({ T }) => T);

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiCeremonialMask size={20} />}
                text={T(
                    'game.apocalypseWorld.playbooks.brainer.brainerGear.title'
                )}
            />
            <BasicList
                readonly={readonly}
                translation="game.apocalypseWorld.playbooks.brainer.brainerGear"
                names={apocalypseWorld.data.playbooks.brainer.gear}
                items={character.brainer.brainerGear}
                onChange={(brainerGear: ApocalypseWorldBasicListItem[]) => {
                    onChange?.({
                        brainer: {
                            ...character.brainer,
                            brainerGear
                        }
                    });
                }}
            />
        </Stack>
    );
};

export default Brainer;
