import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import {
    GiDesertEagle,
    GiMachete,
    GiMachineGunMagazine,
    GiSteyrAug
} from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextEditor from '../../../../common/TextEditor.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';

interface GunLuggerProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'gunLugger'>) => void;
}

const GunLugger = ({ readonly, character, onChange }: GunLuggerProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onGunLuggerChange = (
        data: Partial<ApocalypseWorldCharacter['gunLugger']>
    ) => {
        onChange?.({
            gunLugger: {
                ...character.gunLugger,
                ...data
            }
        });
    };

    return (
        <Stack gap="1.5rem" w="100%">
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiMachineGunMagazine size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.gunLugger.weaponsArmor'
                    )}
                />
                <TextEditor
                    h="12rem"
                    readonly={readonly}
                    value={character.gunLugger.weaponsArmor}
                    onChange={(weaponsArmor: string) => {
                        onGunLuggerChange({ weaponsArmor });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiSteyrAug size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.gunLugger.fuckOffBigGuns.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.gunLugger.fuckOffBigGuns"
                    titleDescription={false}
                    names={
                        apocalypseWorld.data.playbooks.gunLugger.fuckOffBigGuns
                    }
                    items={character.gunLugger.fuckOffBigGuns}
                    onChange={(
                        fuckOffBigGuns: ApocalypseWorldBasicListItem[]
                    ) => {
                        onGunLuggerChange({
                            fuckOffBigGuns
                        });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiDesertEagle size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.gunLugger.seriousGuns.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.gunLugger.seriousGuns"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.gunLugger.seriousGuns}
                    items={character.gunLugger.seriousGuns}
                    onChange={(seriousGuns: ApocalypseWorldBasicListItem[]) => {
                        onGunLuggerChange({
                            seriousGuns
                        });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiMachete size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.gunLugger.backupWeapons.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.gunLugger.backupWeapons"
                    titleDescription={false}
                    names={
                        apocalypseWorld.data.playbooks.gunLugger.backupWeapons
                    }
                    items={character.gunLugger.backupWeapons}
                    onChange={(
                        backupWeapons: ApocalypseWorldBasicListItem[]
                    ) => {
                        onGunLuggerChange({
                            backupWeapons
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default GunLugger;
