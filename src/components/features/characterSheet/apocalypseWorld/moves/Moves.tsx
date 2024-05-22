import { GiBookmarklet, GiFrontalLobe, GiUncertainty } from 'react-icons/gi';
import { Stack } from '@mantine/core';
import {
    apocalypseWorld,
    type ApocalypseWorldCharacter,
    type ApocalypseWorldBasicListItem,
    type ApocalypseWorldDetailedListItem
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import TextEditor from '../../../../common/TextEditor.js';
import { useApp } from '../../../../../contexts/App.js';
import AddOtherMoveRow from './AddOtherMoveRow.js';
import BasicList from '../generic/BasicList.js';
import OtherMoveRow from './OtherMoveRow.js';
import {
    type MoveAction,
    arrayMoveUpDown
} from '../../../../../services/tools.js';

interface MovesProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (data: Partial<ApocalypseWorldCharacter>) => void;
}

const Moves = ({ readonly, character, onChange }: MovesProps) => {
    const { T } = useApp();

    const onPlaybookMovesChange = (moves: ApocalypseWorldBasicListItem[]) => {
        onChange({
            [character.playbook]: {
                ...character[character.playbook],
                moves
            }
        });
    };

    const onOtherMoveChange = (
        index: number,
        move: ApocalypseWorldDetailedListItem
    ) => {
        onChange({
            otherMoves: character.otherMoves.map((tal, idx) =>
                index === idx ? move : tal
            )
        });
    };

    const onOtherMoveCreate = (move: ApocalypseWorldDetailedListItem) => {
        onChange({
            otherMoves: [...character.otherMoves, move]
        });
    };

    const onOtherMoveMove = (index: number, action: MoveAction) => {
        const movedMoves = arrayMoveUpDown(character.otherMoves, index, action);
        if (movedMoves) {
            onChange({
                otherMoves: movedMoves
            });
        }
    };

    const onOtherMoveDelete = (index: number) => {
        onChange({
            otherMoves: character.otherMoves.filter(
                (_move, idx) => index !== idx
            )
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiBookmarklet size={20} />}
                text={T('game.apocalypseWorld.moves')}
            />
            <BasicList
                readonly={readonly}
                translation={`game.apocalypseWorld.playbooks.${character.playbook}.moves`}
                names={apocalypseWorld.data.playbooks[character.playbook].moves}
                items={character[character.playbook].moves}
                onChange={onPlaybookMovesChange}
            />
            <SectionTitle
                iconBefore={<GiUncertainty size={20} />}
                text={T('game.apocalypseWorld.otherMoves')}
            />
            <Stack gap="1.5rem" w="100%">
                {character.otherMoves.map((otherMove, index) => (
                    <OtherMoveRow
                        key={`move-row-${index.toString()}`}
                        readonly={readonly}
                        otherMove={otherMove}
                        onChange={(tal: ApocalypseWorldDetailedListItem) => {
                            onOtherMoveChange(index, tal);
                        }}
                        onMove={(action) => {
                            onOtherMoveMove(index, action);
                        }}
                        onDelete={() => {
                            onOtherMoveDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddOtherMoveRow onCreate={onOtherMoveCreate} />}
            </Stack>
            <SectionTitle
                iconBefore={<GiFrontalLobe size={20} />}
                text={T('game.apocalypseWorld.hold')}
            />
            <Stack gap="1rem" w="100%">
                <TextEditor
                    h="20rem"
                    readonly={readonly}
                    value={character.hold}
                    onChange={(hold: string) => {
                        onChange?.({ hold });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Moves;
