import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdUploadFile, MdOutlineDeleteOutline } from 'react-icons/md';

import Api from '../../../../../services/api';

import './Portrait.css';

interface PortraitProps {
    value: string | null;
    readonly: boolean;
    onChange?: (file: File | null) => void;
}

const allowedMimeTypes = [
    'image/jpeg',
    'image/png'
];

const Portrait: React.FC<PortraitProps> = ({
    value,
    readonly,
    onChange
}) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange?.(file);
        }
    };

    const getInputButton = () => (
        <label htmlFor="character-portrait-input">
            <input
                id="character-portrait-input"
                className="hidden"
                type="file"
                accept={allowedMimeTypes.join(',')}
                onChange={handleFileChange}
            />
            <IconButton component="span">
                <MdUploadFile size={40} />
            </IconButton>
        </label>
    );

    const getDeleteButton = () => (
        value ? (
            <IconButton color="error" onClick={() => onChange?.(null)}>
                <MdOutlineDeleteOutline size={40} />
            </IconButton>
        ) : null
    );

    return (
        <Box className="character-portrait-container">
            <Box className="character-portrait-inner">
                {value ? (
                    <img
                        className="character-portrait-image"
                        src={Api.getAssetUrl(value)}
                        alt="Character Portrait"
                    />
                ) : null}
                {readonly ? null : (
                    <>
                        {getInputButton()}
                        {getDeleteButton()}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default memo(Portrait);
