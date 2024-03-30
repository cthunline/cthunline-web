import { HiPlus } from 'react-icons/hi';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    IconButton
} from '@mui/material';

import { getAssetUrl } from '../../../../../../services/api';
import { type Asset } from '../../../../../../types';

interface ImageListProps {
    assets: Asset[];
    onAdd: (src: string) => void;
}

const ImageAssetList = ({ assets, onAdd }: ImageListProps) =>
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

export default ImageAssetList;
