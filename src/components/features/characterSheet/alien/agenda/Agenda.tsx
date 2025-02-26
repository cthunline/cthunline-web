import type { AlienAgenda } from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiNotebook } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextEditor from '../../../../common/TextEditor.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

type AgendaProps = {
    readonly?: boolean;
    agenda: AlienAgenda;
    onChange?: (agenda: AlienAgenda) => void;
};

const Agenda = ({ readonly, agenda, onChange }: AgendaProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack gap="1rem" w="100%" h="100%">
            <Stack gap="1rem" flex="2 0">
                <SectionTitle
                    iconBefore={<GiNotebook size={20} />}
                    text={T('game.alien.agenda.personalAgenda')}
                />
                <TextEditor
                    w="100%"
                    h={0}
                    flex="1 0"
                    readonly={readonly}
                    value={agenda.personalAgenda}
                    onChange={(personalAgenda: string) => {
                        onChange?.({
                            ...agenda,
                            personalAgenda
                        });
                    }}
                />
            </Stack>
            <Stack gap="1rem" flex="3 0">
                <SectionTitle
                    iconBefore={<GiNotebook size={20} />}
                    text={T('game.alien.agenda.objectives')}
                />
                <TextEditor
                    w="100%"
                    h={0}
                    flex="1 0"
                    readonly={readonly}
                    value={agenda.objectives}
                    onChange={(objectives: string) => {
                        onChange?.({
                            ...agenda,
                            objectives
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Agenda;
