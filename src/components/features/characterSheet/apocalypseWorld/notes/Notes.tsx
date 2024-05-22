import { type ApocalypseWorldCharacter } from '@cthunline/games';
import { GiNotebook } from 'react-icons/gi';
import { Box, Stack } from '@mantine/core';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import TextEditor from '../../../../common/TextEditor.js';
import { useApp } from '../../../../../contexts/App.js';

interface NotesProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'notes'>) => void;
}

const Notes = ({ readonly, character, onChange }: NotesProps) => {
    const { T } = useApp();
    return (
        <Stack gap="1rem" w="100%" flex={1} h={0}>
            <SectionTitle
                iconBefore={<GiNotebook size={20} />}
                text={T('game.apocalypseWorld.moves')}
            />
            <Box flex={1} h={0}>
                <TextEditor
                    h="100%"
                    readonly={readonly}
                    value={character.notes}
                    onChange={(notes: string) => {
                        onChange?.({ notes });
                    }}
                />
            </Box>
        </Stack>
    );
};

export default Notes;
