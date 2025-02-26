import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiArmorDowngrade, GiArmorUpgrade } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';
import Bike from './fragments/Bike.js';
import Gang from './fragments/Gang.js';

interface ChopperProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'chopper'>) => void;
}

const Chopper = ({ readonly, character, onChange }: ChopperProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onGangChange = (
        data: Partial<ApocalypseWorldCharacter['chopper']['gang']>
    ) => {
        onChange?.({
            chopper: {
                ...character.chopper,
                gang: {
                    ...character.chopper.gang,
                    ...data
                }
            }
        });
    };

    return (
        <Stack gap="1.5rem" w="100%">
            <Bike
                w="100%"
                readonly={readonly}
                character={character}
                onChange={onChange}
            />
            <Gang
                w="100%"
                readonly={readonly}
                translation="game.apocalypseWorld.playbooks.chopper.gang"
                gang={character.chopper.gang}
                onChange={onGangChange}
            />
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiArmorUpgrade size={20} />}
                    text={T('game.apocalypseWorld.advantages')}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.chopper.advantages"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.chopper.advantages}
                    items={character.chopper.gang.advantages}
                    onChange={(advantages: ApocalypseWorldBasicListItem[]) => {
                        onGangChange({ advantages });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiArmorDowngrade size={20} />}
                    text={T('game.apocalypseWorld.problems')}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.chopper.problems"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.chopper.problems}
                    items={character.chopper.gang.problems}
                    onChange={(problems: ApocalypseWorldBasicListItem[]) => {
                        onGangChange({ problems });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Chopper;
