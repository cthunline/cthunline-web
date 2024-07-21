import type { WarhammerFantasyTalent } from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';

import { useApp } from '../../../../../contexts/App.js';
import type { MoveAction } from '../../../../../services/tools.js';
import Textarea from '../../../../common/Textarea.js';
import RowInput from '../../generic/row/RowInput.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';

type TalentRowProps = {
    readonly: boolean;
    talent: WarhammerFantasyTalent;
    onChange: (talent: WarhammerFantasyTalent) => void;
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
            <Stack flex="1 0" gap="0.5rem">
                <Group flex="1 0" gap="0.5rem">
                    <Box flex="6 0">
                        <RowInput
                            readonly={readonly}
                            type="string"
                            label={T('game.warhammerFantasy.talent.name')}
                            value={talent.name}
                            onChange={(name: string) => {
                                onChange({ ...talent, name });
                            }}
                        />
                    </Box>
                    <Box flex="1 0">
                        <RowInput
                            readonly={readonly}
                            center
                            type="number"
                            label={T('game.warhammerFantasy.talent.timesTaken')}
                            value={talent.timesTaken}
                            onChange={(timesTaken: number) => {
                                onChange({ ...talent, timesTaken });
                            }}
                        />
                    </Box>
                </Group>
                <Textarea
                    variant="contained"
                    w="100%"
                    readOnly={readonly}
                    size="sm"
                    label={T('game.warhammerFantasy.talent.description')}
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
