import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdUploadFile, MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';

import { getInputFileBase64 } from '../../../../../services/tools';

import './Portrait.css';

interface PortraitProps {
    base64: string;
    readonly: boolean;
    onChange: (base64: string) => void;
}

const allowedMimeTypes = [
    'image/jpeg',
    'image/png'
];

const limitSizeInKb = 250;

const Portrait: React.FC<PortraitProps> = ({
    base64,
    readonly,
    onChange
}) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64String = await getInputFileBase64(file);
            const sizeInKb = file.size / 1000;
            if (sizeInKb > limitSizeInKb) {
                toast.error(`File size is too large (max ${limitSizeInKb}Kb)`);
            } else {
                onChange(base64String);
            }
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
        base64 ? (
            <IconButton color="error" onClick={() => onChange('')}>
                <MdOutlineDeleteOutline size={40} />
            </IconButton>
        ) : null
    );

    return (
        <Box className="character-portrait-container">
            <Box className="character-portrait-inner">
                {base64 ? (
                    <img
                        className="character-portrait-image"
                        src={base64}
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
