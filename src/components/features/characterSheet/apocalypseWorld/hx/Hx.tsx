import { GiRelationshipBounds } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    type ApocalypseWorldCharacter,
    type ApocalypseWorldHx
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import AddHxRow from './AddHxRow.js';
import HxRow from './HxRow.js';
import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';

interface HxProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (hx: Pick<ApocalypseWorldCharacter, 'hx'>) => void;
}

const Hx = ({ readonly, character, onChange }: HxProps) => {
    const { T } = useApp();

    const onHxChange = (index: number, hx: ApocalypseWorldHx) => {
        onChange({
            hx: character.hx.map((h, idx) => (index === idx ? hx : h))
        });
    };

    const onHxAdd = (hx: ApocalypseWorldHx) => {
        onChange({
            hx: [...character.hx, hx]
        });
    };

    const onHxMove = (index: number, action: MoveAction) => {
        const movedHx = arrayMoveUpDown(character.hx, index, action);
        if (movedHx) {
            onChange({
                hx: movedHx
            });
        }
    };

    const onHxDelete = (index: number) => {
        onChange({
            hx: character.hx.filter((_hx, idx) => index !== idx)
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiRelationshipBounds size={20} />}
                text={T('game.apocalypseWorld.hx.title')}
            />
            <Stack gap="1rem" w="100%">
                {character.hx.map((hx, index) => (
                    <HxRow
                        key={`hx-row-${index.toString()}`}
                        readonly={readonly}
                        hx={hx}
                        onChange={(h: ApocalypseWorldHx) => {
                            onHxChange(index, h);
                        }}
                        onMove={(action) => {
                            onHxMove(index, action);
                        }}
                        onDelete={() => {
                            onHxDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddHxRow onAdd={onHxAdd} />}
            </Stack>
        </Stack>
    );
};

export default Hx;
