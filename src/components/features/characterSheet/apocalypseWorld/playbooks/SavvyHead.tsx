import { GiAnvilImpact } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    apocalypseWorld,
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import BasicList from '../generic/BasicList.js';

interface SavvyHeadProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'savvyHead'>) => void;
}

const SavvyHead = ({ readonly, character, onChange }: SavvyHeadProps) => {
    const { T } = useApp();

    const onSavvyHeadChange = (
        data: Partial<ApocalypseWorldCharacter['savvyHead']>
    ) => {
        onChange?.({
            savvyHead: {
                ...character.savvyHead,
                ...data
            }
        });
    };

    return (
        <Stack gap="1.5rem" w="100%">
            <SectionTitle
                iconBefore={<GiAnvilImpact size={20} />}
                text={T(
                    'game.apocalypseWorld.playbooks.savvyHead.workspace.title'
                )}
            />
            <BasicList
                readonly={readonly}
                translation="game.apocalypseWorld.playbooks.savvyHead.workspace"
                titleDescription={false}
                names={apocalypseWorld.data.playbooks.savvyHead.workspace}
                items={character.savvyHead.workspace}
                onChange={(workspace: ApocalypseWorldBasicListItem[]) => {
                    onSavvyHeadChange({
                        workspace
                    });
                }}
            />
        </Stack>
    );
};

export default SavvyHead;
