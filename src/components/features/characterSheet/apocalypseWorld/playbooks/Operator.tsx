import {
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';
import { Stack, Text } from '@mantine/core';
import { GiPayMoney, GiReceiveMoney, GiShakingHands } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextEditor from '../../../../common/TextEditor.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import BasicList from '../generic/BasicList.js';

interface OperatorProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'operator'>) => void;
}

const Operator = ({ readonly, character, onChange }: OperatorProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onOperatorChange = (
        data: Partial<ApocalypseWorldCharacter['operator']>
    ) => {
        onChange?.({
            operator: {
                ...character.operator,
                ...data
            }
        });
    };

    return (
        <Stack gap="1.5rem" w="100%">
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiShakingHands size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.operator.crewContacts.title'
                    )}
                />
                <TextEditor
                    h="16rem"
                    readonly={readonly}
                    value={character.operator.crewContacts}
                    onChange={(crewContacts: string) => {
                        onOperatorChange({ crewContacts });
                    }}
                />
                <Text fz="0.875rem">
                    {T(
                        'game.apocalypseWorld.playbooks.operator.crewContacts.help'
                    )}
                </Text>
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiReceiveMoney size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.operator.payingGigs.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.operator.payingGigs"
                    titleDescription={false}
                    names={apocalypseWorld.data.playbooks.operator.payingGigs}
                    items={character.operator.payingGigs}
                    onChange={(payingGigs: ApocalypseWorldBasicListItem[]) => {
                        onOperatorChange({
                            payingGigs
                        });
                    }}
                />
            </Stack>
            <Stack gap="1rem" w="100%">
                <SectionTitle
                    iconBefore={<GiPayMoney size={20} />}
                    text={T(
                        'game.apocalypseWorld.playbooks.operator.obligationGigs.title'
                    )}
                />
                <BasicList
                    readonly={readonly}
                    translation="game.apocalypseWorld.playbooks.operator.obligationGigs"
                    titleDescription={false}
                    names={
                        apocalypseWorld.data.playbooks.operator.obligationGigs
                    }
                    items={character.operator.obligationGigs}
                    onChange={(
                        obligationGigs: ApocalypseWorldBasicListItem[]
                    ) => {
                        onOperatorChange({
                            obligationGigs
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Operator;
