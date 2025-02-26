import type { ApocalypseWorldCharacter } from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiNotebook } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import TextEditor from '../../../../common/TextEditor.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

interface NotesProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'notes'>) => void;
}

const Notes = ({ readonly, character, onChange }: NotesProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack gap="1rem" w="100%" h="100%">
            <SectionTitle
                iconBefore={<GiNotebook size={20} />}
                text={T('game.apocalypseWorld.notes')}
            />
            <TextEditor
                w="100%"
                h={0}
                flex="1 0"
                readonly={readonly}
                value={character.notes}
                onChange={(notes: string) => {
                    onChange?.({ notes });
                }}
            />
        </Stack>
    );
};

export default Notes;
