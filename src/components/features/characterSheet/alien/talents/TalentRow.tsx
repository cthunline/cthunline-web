import type { AlienTalent } from '@cthunline/games';
import { Group, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import type { MoveAction } from '../../../../../services/tools.js';
import Textarea from '../../../../common/Textarea.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type TalentRowProps = {
    readonly: boolean;
    talent: AlienTalent;
    onChange: (talent: AlienTalent) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const TalentRow = ({
    readonly,
    talent,
    onChange,
    onMove,
    onDelete
}: TalentRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%" gap="1rem">
            <Stack flex="1 0">
                <RowInput
                    w="100%"
                    label={T('game.alien.talents.name')}
                    readonly={readonly}
                    type="string"
                    value={talent.name}
                    onChange={(name: string) => {
                        onChange({ ...talent, name });
                    }}
                />
                <Textarea
                    variant="contained"
                    w="100%"
                    rows={5}
                    readOnly={readonly}
                    size="sm"
                    label={T('game.alien.talents.description')}
                    value={talent.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onChange({ ...talent, description: e.target.value });
                    }}
                />
            </Stack>
            {!readonly && !!onDelete && (
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default TalentRow;
