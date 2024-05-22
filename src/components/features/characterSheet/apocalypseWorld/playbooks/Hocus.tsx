import {
    GiArmorDowngrade,
    GiArmorUpgrade,
    GiThreeFriends
} from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    apocalypseWorld,
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import Followers from './fragments/Followers.js';
import BasicList from '../generic/BasicList.js';

interface HocusProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'hocus'>) => void;
}

const Hocus = ({ readonly, character, onChange }: HocusProps) => {
    const { T } = useApp();

    const onFollowersChange = (
        data: Partial<ApocalypseWorldCharacter['hocus']['followers']>
    ) => {
        onChange?.({
            hocus: {
                ...character.hocus,
                followers: {
                    ...character.hocus.followers,
                    ...data
                }
            }
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <Followers
                w="100%"
                readonly={readonly}
                character={character}
                onChange={onChange}
            />
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiThreeFriends size={20} />}
                    text={T('game.apocalypseWorld.playbooks.hocus.types.title')}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.hocus.types"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.hocus.types}
                    items={character.hocus.followers.types}
                    onChange={(types: ApocalypseWorldBasicListItem[]) => {
                        onFollowersChange({ types });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiArmorUpgrade size={20} />}
                    text={T('game.apocalypseWorld.advantages')}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.hocus.advantages"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.hocus.advantages}
                    items={character.hocus.followers.advantages}
                    onChange={(advantages: ApocalypseWorldBasicListItem[]) => {
                        onFollowersChange({ advantages });
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
                    translation="game.apocalypseWorld.playbooks.hocus.problems"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.hocus.problems}
                    items={character.hocus.followers.problems}
                    onChange={(problems: ApocalypseWorldBasicListItem[]) => {
                        onFollowersChange({ problems });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Hocus;
