import { Group } from '@mantine/core';

import type { MoveAction } from '../../../../../services/tools.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type TalentRowProps = {
    readonly: boolean;
    talent: string;
    onChange: (talent: string) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const TalentRow = ({
    readonly,
    talent,
    onChange,
    onMove,
    onDelete
}: TalentRowProps) => (
    <Group w="100%" gap="1rem">
        <RowInput
            flex="1 0"
            readonly={readonly}
            type="string"
            value={talent}
            onChange={(tal: string) => {
                onChange(tal);
            }}
        />
        {!readonly && !!onDelete && (
            <RowMenuButton onMove={onMove} onDelete={onDelete} />
        )}
    </Group>
);

export default TalentRow;
