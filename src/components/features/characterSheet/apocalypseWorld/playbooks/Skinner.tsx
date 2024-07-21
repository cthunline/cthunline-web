import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiSparklingSabre, GiSpectacles } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';

interface SkinnerProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'skinner'>) => void;
}

const Skinner = ({ readonly, character, onChange }: SkinnerProps) => {
    const { T } = useApp();

    const onSkinnerChange = (
        data: Partial<ApocalypseWorldCharacter['skinner']>
    ) => {
        onChange?.({
            skinner: {
                ...character.skinner,
                ...data
            }
        });
    };

    return (
        <Stack gap="1.5rem" w="100%">
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiSparklingSabre size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.skinner.graciousWeapons.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.skinner.graciousWeapons"
                    titleDescription={false}
                    names={
                        apocalypseWorld.data.playbooks.skinner.graciousWeapons
                    }
                    items={character.skinner.graciousWeapons}
                    onChange={(
                        graciousWeapons: ApocalypseWorldBasicListItem[]
                    ) => {
                        onSkinnerChange({
                            graciousWeapons
                        });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiSpectacles size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.skinner.luxeGear.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.skinner.luxeGear"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.skinner.luxeGear}
                    items={character.skinner.luxeGear}
                    onChange={(luxeGear: ApocalypseWorldBasicListItem[]) => {
                        onSkinnerChange({
                            luxeGear
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Skinner;
