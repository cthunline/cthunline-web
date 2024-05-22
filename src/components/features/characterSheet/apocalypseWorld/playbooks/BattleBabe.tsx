import { type ApocalypseWorldCharacter } from '@cthunline/games';
import { GiNotebook } from 'react-icons/gi';
import { Box, Stack } from '@mantine/core';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import TextEditor from '../../../../common/TextEditor.js';
import { useApp } from '../../../../../contexts/App.js';

interface BattleBabeProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'battleBabe'>) => void;
}

const BattleBabe = ({ readonly, character, onChange }: BattleBabeProps) => {
    const { T } = useApp();
    return (
        <Stack gap="1rem" w="100%" flex={1} h={0}>
            <SectionTitle
                iconBefore={<GiNotebook size={20} />}
                text={T(
                    'game.apocalypseWorld.playbooks.battleBabe.customWeapons'
                )}
            />
            <Box flex={1} h={0}>
                <TextEditor
                    h="100%"
                    readonly={readonly}
                    value={character.battleBabe.customWeapons}
                    onChange={(customWeapons: string) => {
                        onChange?.({
                            battleBabe: {
                                ...character.battleBabe,
                                customWeapons
                            }
                        });
                    }}
                />
            </Box>
        </Stack>
    );
};

export default BattleBabe;
