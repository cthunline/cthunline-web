import { type ApocalypseWorldHx } from '@cthunline/games';
import { Group } from '@mantine/core';

import { type MoveAction } from '../../../../../services/tools.js';
import RowMenuButton from '../../generic/row/RowMenuButton.js';
import { useApp } from '../../../../../contexts/App.js';
import RowInput from '../../generic/row/RowInput.js';

type HxRowProps = {
    readonly: boolean;
    hx: ApocalypseWorldHx;
    onChange: (hx: ApocalypseWorldHx) => void;
    onMove: (action: MoveAction) => void;
    onDelete: () => void;
};

const HxRow = ({ readonly, hx, onChange, onMove, onDelete }: HxRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%" gap="1rem">
            <RowInput
                readonly={readonly}
                type="string"
                flex="1 0"
                label={T('game.apocalypseWorld.hx.character')}
                value={hx.character}
                onChange={(character: string) => {
                    onChange({ ...hx, character });
                }}
            />
            <RowInput
                readonly={readonly}
                type="string"
                w="5rem"
                label={T('game.apocalypseWorld.hx.character')}
                value={hx.value}
                onChange={(value: string) => {
                    onChange({ ...hx, value });
                }}
            />
            {!readonly && !!onDelete && (
                <RowMenuButton onMove={onMove} onDelete={onDelete} />
            )}
        </Group>
    );
};

export default HxRow;
