import type {
    WarhammerFantasyArmour,
    WarhammerFantasyCharacter
} from '@cthunline/games';
import { Stack } from '@mantine/core';
import { GiChestArmor } from 'react-icons/gi';

import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import AddArmourRow from './AddArmourRow.js';
import ArmourRow from './ArmourRow.js';

interface ArmourProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (armour: Pick<WarhammerFantasyCharacter, 'armour'>) => void;
}

const Armour = ({ readonly, character, onChange }: ArmourProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onArmourChange = (index: number, arm: WarhammerFantasyArmour) => {
        onChange({
            armour: character.armour.map((a, idx) => (index === idx ? arm : a))
        });
    };

    const onArmourCreate = (arm: WarhammerFantasyArmour) => {
        onChange({
            armour: [...character.armour, arm]
        });
    };

    const onArmourMove = (index: number, action: MoveAction) => {
        const movedArmour = arrayMoveUpDown(character.armour, index, action);
        if (movedArmour) {
            onChange({
                armour: movedArmour
            });
        }
    };

    const onArmourDelete = (index: number) => {
        onChange({
            armour: character.armour.filter((_armour, idx) => index !== idx)
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiChestArmor size={20} />}
                text={T('game.warhammerFantasy.common.armour')}
            />
            <Stack gap="1rem" w="100%">
                {character.armour.map((armour, index) => (
                    <ArmourRow
                        key={`armour-row-${index.toString()}`}
                        readonly={readonly}
                        armour={armour}
                        onChange={(arm: WarhammerFantasyArmour) => {
                            onArmourChange(index, arm);
                        }}
                        onMove={(action) => {
                            onArmourMove(index, action);
                        }}
                        onDelete={() => {
                            onArmourDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddArmourRow onCreate={onArmourCreate} />}
            </Stack>
        </Stack>
    );
};

export default Armour;
