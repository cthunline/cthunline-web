import {
    List,
    ListItem,
    ListItemButton,
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

export enum ExplorerItemType {
    directory = 'directory',
    file = 'file'
}

export interface ExplorerItem {
    id: number;
    name: string;
    type: ExplorerItemType;
    parentId?: number;
    icon?: JSX.Element;
}

interface ExplorerProps {
    className?: string;
    items: ExplorerItem[];
    directoryId?: number;
    selectedId?: number;
    onDirectoryBack: () => void;
    onDirectoryClick: (id: number) => void;
    onFileClick?: (id: number) => void;
    onDelete?: (type: ExplorerItemType, id: number, name: string) => void;
}

const Explorer = ({
    className,
    items,
    directoryId,
    selectedId,
    onDirectoryBack,
    onDirectoryClick,
    onFileClick,
    onDelete
}: ExplorerProps) => {
    const filteredItems = items.filter(({ parentId }) =>
        directoryId ? parentId === directoryId : !parentId
    );
    const directories = filteredItems.filter(
        ({ type }) => type === ExplorerItemType.directory
    );
    const files = filteredItems.filter(
        ({ type }) => type === ExplorerItemType.file
    );

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
        <List className={`full-width ${className ?? ''}`}>
            {directoryId ? (
                <ListItemButton onClick={onDirectoryBack}>
                    <ListItemIcon>
                        <MdOutlineKeyboardBackspace />
                    </ListItemIcon>
                    <ListItemText primary=".." />
                </ListItemButton>
            ) : null}
            {[...directories, ...files].map(({ id, name, type, icon }) => {
                const isDirectory = type === ExplorerItemType.directory;
                return (
                    <ListItem
                        key={`explorer-${type}-${id}`}
                        secondaryAction={
                            onDelete ? (
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
                            ) : null
                        }
                        disablePadding
                    >
                        <ListItemButton
                            className={`${
                                isDirectory || onFileClick ? 'clickable' : ''
                            }`}
                            selected={selectedId === id}
                            onClick={() => {
                                if (isDirectory) {
                                    onDirectoryClick(id);
                                } else if (onFileClick) {
                                    onFileClick(id);
                                }
                            }}
                        >
                            <ListItemIcon>{getIcon(type, icon)}</ListItemIcon>
                            <ListItemText primary={name} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default Explorer;
