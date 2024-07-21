import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiArmorDowngrade, GiArmorUpgrade } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';
import Gang from './fragments/Gang.js';
import Holding from './fragments/Holding.js';

interface HardHolderProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'hardHolder'>) => void;
}

const HardHolder = ({ readonly, character, onChange }: HardHolderProps) => {
    const { T } = useApp();

    const onHoldingChange = (
        data: Partial<ApocalypseWorldCharacter['hardHolder']['holding']>
    ) => {
        onChange?.({
            hardHolder: {
                ...character.hardHolder,
                holding: {
                    ...character.hardHolder.holding,
                    ...data
                }
            }
        });
    };

    const onHoldingGangChange = (
        data: Partial<ApocalypseWorldCharacter['hardHolder']['holding']['gang']>
    ) => {
        onHoldingChange({
            gang: {
                ...character.hardHolder.holding.gang,
                ...data
            }
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <Holding
                readonly={readonly}
                character={character}
                onChange={onChange}
            />
            <Gang
                w="100%"
                readonly={readonly}
                translation="game.apocalypseWorld.playbooks.hardHolder.gang"
                gang={character.hardHolder.holding.gang}
                onChange={onHoldingGangChange}
            />
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiArmorUpgrade size={20} />}
                    text={T('game.apocalypseWorld.advantages')}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.hardHolder.advantages"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.hardHolder.advantages}
                    items={character.hardHolder.holding.advantages}
                    onChange={(advantages: ApocalypseWorldBasicListItem[]) => {
                        onHoldingChange({ advantages });
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
                    translation="game.apocalypseWorld.playbooks.hardHolder.problems"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.hardHolder.problems}
                    items={character.hardHolder.holding.problems}
                    onChange={(problems: ApocalypseWorldBasicListItem[]) => {
                        onHoldingChange({ problems });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default HardHolder;
