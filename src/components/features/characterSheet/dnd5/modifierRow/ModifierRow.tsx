import { Box, Checkbox, Group } from '@mantine/core';

import { displayModifier } from '../dnd5Sheet.helper';
import TextInput from '../../../../common/TextInput';

interface ModifierRowProps {
    readonly?: boolean;
    text: string;
    modifier: number;
    proficient: boolean;
    onProficientChange: (proficient: boolean) => void;
}

const ModifierRow = ({
    readonly,
    text,
    modifier,
    proficient,
    onProficientChange
}: ModifierRowProps) => (
    <Group w="100%" gap="1rem">
        <Box flex="7 0">{text}</Box>
        <Box flex="3 0">
            <TextInput
                w="100%"
                readOnly
                size="sm"
                value={displayModifier(modifier)}
            />
        </Box>
        <Box>
            <Checkbox
                checked={proficient}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readonly) {
                        onProficientChange(e.target.checked);
                    }
                }}
            />
        </Box>
    </Group>
);

export default ModifierRow;
