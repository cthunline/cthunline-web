import type { ApocalypseWorldDetailedListItem } from '@cthunline/games';
import { Box, Checkbox, Group, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import type { MoveAction } from '../../../../../services/tools.js';
import Textarea from '../../../../common/Textarea.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type OtherMoveRowProps = {
    readonly: boolean;
    otherMove: ApocalypseWorldDetailedListItem;
    onChange: (move: ApocalypseWorldDetailedListItem) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const OtherMoveRow = ({
    readonly,
    otherMove,
    onChange,
    onMove,
    onDelete
}: OtherMoveRowProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%" gap="1rem" align="center">
            <Group w="100%" gap="1rem" align="center">
                <Checkbox
                    defaultChecked={otherMove.enabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!readonly) {
                            onChange({
                                ...otherMove,
                                enabled: e.target.checked
                            });
                        }
                    }}
                />
                <RowInput
                    readonly={readonly}
                    flex="1 0"
                    type="string"
                    label={T('game.apocalypseWorld.element.title')}
                    value={otherMove.title}
                    onChange={(title: string) => {
                        onChange({ ...otherMove, title });
                    }}
                />
                {!readonly && !!onDelete && (
                    <RowMenuButton onMove={onMove} onDelete={onDelete} />
                )}
            </Group>
            <Group w="100%" gap="1rem" align="center">
                <Box w="1.25rem" />
                <Textarea
                    variant="contained"
                    flex="1 0"
                    rows={4}
                    readOnly={readonly}
                    size="sm"
                    label={T('game.apocalypseWorld.element.description')}
                    value={otherMove.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onChange({ ...otherMove, description: e.target.value });
                    }}
                />
                {!readonly && !!onDelete && <Box w="1.75rem" />}
            </Group>
        </Stack>
    );
};

export default OtherMoveRow;
