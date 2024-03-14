import { MdOutlineSave, MdOutlineDeleteOutline } from 'react-icons/md';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiPlus } from 'react-icons/hi';
import z from 'zod';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton,
    Tooltip,
    TextField,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemSecondaryAction,
    Stack
} from '@mui/material';

import { useApp } from '../../../../contexts/App';
import useUserSketch from '../../../../hooks/useUserSketch';
import { getAssetUrl } from '../../../../../services/api';
import { Asset, SketchData, SketchCreateBody } from '../../../../../types';

import './SketchWidget.css';

export interface ActionButtonData {
    text: string;
    icon: JSX.Element;
    handler: () => void;
}

export const ActionButton = ({ text, handler, icon }: ActionButtonData) => (
    <Tooltip placement="bottom" title={text}>
        <IconButton
            className="sketch-action-button ml-15 mr-15"
            size="medium"
            onClick={handler}
        >
            {icon}
        </IconButton>
    </Tooltip>
);

interface ImageListProps {
    assets: Asset[];
    onAdd: (src: string) => void;
}

export const ImageAssetList = ({ assets, onAdd }: ImageListProps) =>
    assets.length ? (
        <ImageList className="sketch-widget-assets full-width" cols={3} gap={5}>
            {assets.map(({ name, path }, index) => {
                const src = getAssetUrl(path);
                return (
                    <ImageListItem key={`asset-${index.toString()}`}>
                        <img
                            src={`${src}?w=248&fit=crop&auto=format`}
                            alt={name}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={name}
                            actionIcon={
                                <IconButton onClick={() => onAdd(src)}>
                                    <HiPlus />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                );
            })}
        </ImageList>
    ) : null;

interface UserSketchFormProps {
    sketch: Omit<SketchData, 'events'>;
    onSubmit: (data: SketchCreateBody) => Promise<void>;
}

const userSketchFormSchema = z.object({
    name: z.string().min(3)
});

type UserSketchFormData = z.infer<typeof userSketchFormSchema>;

export const UserSketchForm = ({ sketch, onSubmit }: UserSketchFormProps) => {
    const { T } = useApp();

    const { control, handleSubmit } = useForm<UserSketchFormData>({
        resolver: zodResolver(userSketchFormSchema),
        defaultValues: {
            name: ''
        }
    });

    const onFormSubmit = ({ name }: UserSketchFormData) => {
        onSubmit({
            name,
            sketch
        });
    };

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit(onFormSubmit)}
            direction="column"
            gap="1rem"
            padding="0.25rem 0"
        >
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        className="form-input"
                        label={T('common.name')}
                        error={!!error}
                    />
                )}
            />
            <Button
                className="form-button"
                type="submit"
                variant="contained"
                size="large"
                startIcon={<MdOutlineSave />}
            >
                {T('action.save')}
            </Button>
        </Stack>
    );
};

interface UserSketchSelectorProps {
    onSelect: (sketchId: number) => void;
}

export const UserSketchSelector = ({ onSelect }: UserSketchSelectorProps) => {
    const { userSketchs, deleteUserSketch } = useUserSketch(true);

    const onDelete = async (sketchId: number) => {
        await deleteUserSketch({ sketchId });
    };

    return (
        <List>
            {userSketchs.map(({ id, name }) => (
                <ListItem
                    key={`user-sketch-${id}`}
                    secondaryAction={
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                size="medium"
                                color="error"
                                onClick={() => onDelete(id)}
                            >
                                <MdOutlineDeleteOutline />
                            </IconButton>
                        </ListItemSecondaryAction>
                    }
                    disablePadding
                >
                    <ListItemButton onClick={() => onSelect(id)}>
                        {name}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
