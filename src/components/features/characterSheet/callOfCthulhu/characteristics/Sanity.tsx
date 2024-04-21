import { type CoCSanity } from '@cthunline/games';
import { Box, Group } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { sanityKeys } from './characteristics.data.js';
import { controlSanity } from '../cocSheet.helper.js';
import { useApp } from '../../../../../contexts/App.js';

interface SanityProps {
    data: CoCSanity;
    readonly: boolean;
    onChange: (data: CoCSanity) => void;
}

const Sanity = ({ data, readonly, onChange }: SanityProps) => {
    const { T } = useApp();

    return (
        <Group w="100%" gap="0.25rem">
            <Box flex="1 0">
                {T('game.callOfCthulhu.characteristic.sanity')}
            </Box>
            {sanityKeys.map(({ key, textKey, editable }) => (
                <Box flex="1 0" key={key.toString()}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly || !editable}
                        size="sm"
                        label={T(`game.callOfCthulhu.common.${textKey}`)}
                        value={data[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                controlSanity({
                                    ...data,
                                    [key]: Number(onlyNumbers(e.target.value))
                                })
                            );
                        }}
                    />
                </Box>
            ))}
        </Group>
    );
};

export default Sanity;
