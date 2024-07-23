import { ActionIcon, FileButton, Stack } from '@mantine/core';
import { MdOutlineDeleteOutline, MdUploadFile } from 'react-icons/md';

import { getAssetUrl } from '../../../../../services/api.js';

interface PortraitProps {
    value: string | null;
    readonly: boolean;
    onChange?: (file: File | null) => void;
}

const allowedMimeTypes = ['image/jpeg', 'image/png'];

const Portrait = ({ value, readonly, onChange }: PortraitProps) => {
    const handleFileChange = (file: File | null) => {
        if (file) {
            onChange?.(file);
        }
    };

    return (
        <Stack
            align="center"
            justify="center"
            w="100%"
            h="12rem"
            pos="relative"
            p="10px"
            style={{
                border: '1px solid var(--palette-background-tertiary)',
                borderRadius: '0.25rem'
            }}
        >
            {value ? (
                <img
                    src={getAssetUrl(value)}
                    alt="Character Portrait"
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        position: 'absolute'
                    }}
                />
            ) : null}
            {readonly ? null : (
                <>
                    <FileButton
                        onChange={handleFileChange}
                        accept={allowedMimeTypes.join(',')}
                    >
                        {(props) => (
                            <ActionIcon {...props}>
                                <MdUploadFile size={40} />
                            </ActionIcon>
                        )}
                    </FileButton>
                    {!!value && (
                        <ActionIcon
                            color="red"
                            onClick={() => onChange?.(null)}
                        >
                            <MdOutlineDeleteOutline size={40} />
                        </ActionIcon>
                    )}
                </>
            )}
        </Stack>
    );
};

export default Portrait;
