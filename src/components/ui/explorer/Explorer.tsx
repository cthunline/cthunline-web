import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction
} from '@mui/material';
import {
    MdFolder,
    MdOutlineInsertDriveFile,
    MdOutlineDeleteOutline,
    MdOutlineKeyboardBackspace
} from 'react-icons/md';

import './Explorer.css';

export enum ExplorerItemType {
    directory = 'directory',
    file = 'file'
}

export interface ExplorerItem {
    id: string;
    name: string;
    type: ExplorerItemType;
    parentId?: string;
    icon?: JSX.Element;
}

interface ExplorerProps {
    className?: string;
    items: ExplorerItem[];
    directoryId?: string;
    onBack: () => void;
    onDirectory: (directoryId: string) => void;
    onDelete: (type: ExplorerItemType, id: string, name: string) => void;
}

const Explorer = ({
    className,
    items,
    directoryId,
    onBack,
    onDirectory,
    onDelete
}: ExplorerProps) => {
    const filteredItems = items.filter(({ parentId }) => (
        directoryId ? parentId === directoryId : !parentId
    ));
    const directories = filteredItems.filter(({ type }) => (
        type === ExplorerItemType.directory
    ));
    const files = filteredItems.filter(({ type }) => (
        type === ExplorerItemType.file
    ));

    const getIcon = (type: ExplorerItemType, icon?: JSX.Element) => {
        if (icon) {
            return icon;
        }
        if (type === ExplorerItemType.directory) {
            return <MdFolder size={25} />;
        }
        if (type === ExplorerItemType.file) {
            return <MdOutlineInsertDriveFile size={25} />;
        }
        return null;
    };

    return (
        <List className={`explorer-list ${className ?? ''}`}>
            {directoryId ? (
                <ListItem
                    className="explorer-list-item clickable"
                    onClick={onBack}
                >
                    <ListItemIcon>
                        <MdOutlineKeyboardBackspace />
                    </ListItemIcon>
                    <ListItemText primary=".." />
                </ListItem>
            ) : null}
            {[...directories, ...files].map(({
                id,
                name,
                type,
                icon
            }) => {
                const isDirectory = type === ExplorerItemType.directory;
                return (
                    <ListItem
                        key={`explorer-item-${id}`}
                        className={`explorer-list-item ${isDirectory ? 'clickable' : ''}`}
                        onClick={() => {
                            if (isDirectory) {
                                onDirectory(id);
                            }
                        }}
                    >
                        <ListItemIcon>
                            {getIcon(type, icon)}
                        </ListItemIcon>
                        <ListItemText primary={name} />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                size="medium"
                                color="error"
                                onClick={() => onDelete(type, id, name)}
                            >
                                <MdOutlineDeleteOutline />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default Explorer;
