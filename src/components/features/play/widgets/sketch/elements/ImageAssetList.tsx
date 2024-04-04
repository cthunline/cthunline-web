import { Box, type BoxProps, Grid, UnstyledButton, Image } from '@mantine/core';

import { getAssetUrl } from '../../../../../../services/api';
import { type Asset } from '../../../../../../types';

interface ImageListProps extends BoxProps {
    assets: Asset[];
    onAdd: (src: string) => void;
    scroll?: boolean;
}

const ImageAssetList = ({ assets, onAdd, scroll, ...props }: ImageListProps) =>
    assets.length ? (
        <Box
            w="100%"
            p="1rem"
            {...props}
            style={{ overflowY: scroll ? 'auto' : undefined, ...props.style }}
        >
            <Grid w="100%" columns={3}>
                {assets.map(({ /* name, */ path }, index) => {
                    const src = getAssetUrl(path);
                    return (
                        <Grid.Col span={1} key={`asset-${index.toString()}`}>
                            <UnstyledButton
                                w="100%"
                                h="100%"
                                pos="relative"
                                style={{ overflow: 'hidden' }}
                                onClick={() => onAdd(src)}
                            >
                                {/* TODO display image name somewhere ? */}
                                <Image
                                    w="100%"
                                    h="100%"
                                    fit="cover"
                                    src={`${src}?w=248&fit=crop&auto=format`}
                                />
                            </UnstyledButton>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Box>
    ) : null;

export default ImageAssetList;
