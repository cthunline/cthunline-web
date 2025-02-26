import type {
    ApocalypseWorldCharacter,
    ApocalypseWorldHx
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiRelationshipBounds } from 'react-icons/gi';

import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddHxRow from './AddHxRow.js';
import HxRow from './HxRow.js';

interface HxProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (hx: Pick<ApocalypseWorldCharacter, 'hx'>) => void;
}

const Hx = ({ readonly, character, onChange }: HxProps) => {
    const T = useLocaleStore(({ T }) => T);

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
