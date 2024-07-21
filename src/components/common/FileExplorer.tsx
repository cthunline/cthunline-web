import { ActionIcon, Stack, type StackProps } from '@mantine/core';
import { useMemo } from 'react';
import {
    MdEdit,
    MdFolder,
    MdOutlineDeleteOutline,
    MdOutlineInsertDriveFile,
    MdOutlineKeyboardBackspace
} from 'react-icons/md';

import { sortObjectsBy } from '../../services/tools.js';
import InteractiveList from './InteractiveList.js';

export enum FileExplorerItemType {
    directory = 'directory',
    file = 'file'
}

export interface FileExplorerItem {
    id: number;
    name: string;
    type: FileExplorerItemType;
    parentId?: number;
    icon?: JSX.Element;
}

interface FileExplorerProps
    extends Pick<StackProps, 'w' | 'miw' | 'maw' | 'h' | 'mih' | 'mah'> {
    items: FileExplorerItem[];
    directoryId?: number;
    selectedId?: number;
    onDirectoryBack: () => void;
    onDirectoryClick: (id: number) => void;
    onFileClick?: (id: number) => void;
    onEdit?: (type: FileExplorerItemType, id: number, name: string) => void;
    onDelete?: (type: FileExplorerItemType, id: number, name: string) => void;
    scroll?: boolean;
    sort?: boolean;
}

const FileExplorer = ({
    items,
    directoryId,
    selectedId,
    onDirectoryBack,
    onDirectoryClick,
    onFileClick,
    onEdit,
    onDelete,
    scroll,
    sort,
    ...props
}: FileExplorerProps) => {
    const [directories, files] = useMemo(() => {
        const filteredItems = items.filter(({ parentId }) =>
            directoryId ? parentId === directoryId : !parentId
        );
        const dirs = filteredItems.filter(
            ({ type }) => type === FileExplorerItemType.directory
        );
        if (sort) {
            sortObjectsBy(dirs, 'name');
        }
        const fls = filteredItems.filter(
            ({ type }) => type === FileExplorerItemType.file
        );
        if (sort) {
            sortObjectsBy(fls, 'name');
        }
        return [dirs, fls];
    }, [items, directoryId, sort]);

    const getIcon = (type: FileExplorerItemType, icon?: JSX.Element) => {
        if (icon) {
            return icon;
        }
        if (type === FileExplorerItemType.directory) {
            return <MdFolder size={25} />;
        }
        if (type === FileExplorerItemType.file) {
            return <MdOutlineInsertDriveFile size={25} />;
        }
        return null;
    };

    return (
        <Stack
            w="100%"
            style={{ overflowY: scroll ? 'auto' : undefined }}
            {...props}
        >
            <InteractiveList>
                {directoryId ? (
                    <InteractiveList.Item
                        leftIcon={<MdOutlineKeyboardBackspace />}
                        onClick={onDirectoryBack}
                    >
                        ..
                    </InteractiveList.Item>
                ) : null}
                {[...directories, ...files].map(({ id, name, type, icon }) => {
                    const isDirectory = type === FileExplorerItemType.directory;
                    return (
                        <InteractiveList.Item
                            key={`explorer-${type}-${id}`}
                            selected={!!selectedId && selectedId === id}
                            leftIcon={getIcon(type, icon)}
                            rightAction={
                                <>
                                    {isDirectory && !!onEdit && (
                                        <ActionIcon
                                            onClick={() =>
                                                onEdit(type, id, name)
                                            }
                                        >
                                            <MdEdit />
                                        </ActionIcon>
                                    )}
                                    {!!onDelete && (
                                        <ActionIcon
                                            color="red"
                                            onClick={() =>
                                                onDelete(type, id, name)
                                            }
                                        >
                                            <MdOutlineDeleteOutline />
                                        </ActionIcon>
                                    )}
                                </>
                            }
                            onClick={() => {
                                if (isDirectory) {
                                    onDirectoryClick(id);
                                } else if (onFileClick) {
                                    onFileClick(id);
                                }
                            }}
                        >
                            {name}
                        </InteractiveList.Item>
                    );
                })}
            </InteractiveList>
        </Stack>
    );
};

export default FileExplorer;
