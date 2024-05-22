import { type ApocalypseWorldCharacter } from '@cthunline/games';
import { Stack } from '@mantine/core';

import Cars from './fragments/Cars.js';

interface DriverProps {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'driver'>) => void;
}

const Driver = ({ readonly, character, onChange }: DriverProps) => (
    <Stack gap="1rem" w="100%">
        <Cars readonly={readonly} character={character} onChange={onChange} />
    </Stack>
);

export default Driver;
