import type { ApocalypseWorldCharacter } from '@cthunline/games';
import { Box, Stack } from '@mantine/core';
import { GiHandBag } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import TextEditor from '../../../../common/TextEditor.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

interface GearBarterProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'gearAndBarter'>) => void;
}

const GearBarter = ({ readonly, character, onChange }: GearBarterProps) => {
    const { T } = useApp();
    return (
        <Stack gap="1rem" w="100%" flex={1} h={0}>
            <SectionTitle
                iconBefore={<GiHandBag size={20} />}
                text={T('game.apocalypseWorld.gearBarter')}
            />
            <Box flex={1} h={0}>
                <TextEditor
                    h="100%"
                    readonly={readonly}
                    value={character.gearAndBarter}
                    onChange={(gearAndBarter: string) => {
                        onChange?.({ gearAndBarter });
                    }}
                />
            </Box>
        </Stack>
    );
};

export default GearBarter;
