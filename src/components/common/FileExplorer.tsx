import { ActionIcon, Stack, type StackProps } from '@mantine/core';
import {
    MdFolder,
    MdOutlineInsertDriveFile,
    MdOutlineDeleteOutline,
    MdOutlineKeyboardBackspace
} from 'react-icons/md';

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
    onDelete?: (type: FileExplorerItemType, id: number, name: string) => void;
    scroll?: boolean;
}

const FileExplorer = ({
    items,
    directoryId,
    selectedId,
    onDirectoryBack,
    onDirectoryClick,
    onFileClick,
    onDelete,
    scroll,
    ...props
}: FileExplorerProps) => {
    const filteredItems = items.filter(({ parentId }) =>
        directoryId ? parentId === directoryId : !parentId
    );
    const directories = filteredItems.filter(
        ({ type }) => type === FileExplorerItemType.directory
    );
    const files = filteredItems.filter(
        ({ type }) => type === FileExplorerItemType.file
    );

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
                            leftIcon={getIcon(type, icon)}
                            rightAction={
                                !!onDelete && (
                                    <ActionIcon
                                        color="red"
                                        onClick={() => onDelete(type, id, name)}
                                    >
                                        <MdOutlineDeleteOutline />
                                    </ActionIcon>
                                )
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
