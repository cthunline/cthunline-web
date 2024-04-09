import { MdOutlineDeleteOutline } from 'react-icons/md';
import { ActionIcon } from '@mantine/core';
import { modals } from '@mantine/modals';

import InteractiveList from '../../../../../common/InteractiveList.js';
import { type Sketch } from '../../../../../../types/index.js';
import { useApp } from '../../../../../contexts/App.js';

interface UserSketchSelectorProps {
    userSketchs: Sketch[];
    onLoad: (sketchId: number) => void;
    onDelete: (sketchId: number) => void;
}

const UserSketchLoad = ({
    userSketchs,
    onLoad,
    onDelete
}: UserSketchSelectorProps) => {
    const { T } = useApp();

    const handleDelete = (sketchId: number) => {
        modals.openConfirmModal({
            centered: true,
            title: T('widget.sketch.deleteSketchConfirm'),
            labels: {
                confirm: T('action.confirm'),
                cancel: T('action.cancel')
            },
            onConfirm: () => {
                onDelete(sketchId);
            }
        });
    };

    return (
        <InteractiveList>
            {userSketchs.map(({ id, name }) => (
                <InteractiveList.Item
                    key={`user-sketch-${id}`}
                    onClick={() => onLoad(id)}
                    rightAction={
                        <ActionIcon
                            color="red"
                            onClick={() => handleDelete(id)}
                        >
                            <MdOutlineDeleteOutline />
                        </ActionIcon>
                    }
                >
                    {name}
                </InteractiveList.Item>
            ))}
        </InteractiveList>
    );
};

export default UserSketchLoad;
