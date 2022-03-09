import React, { memo } from 'react';
import { Box, IconButton } from '@mui/material';
import { MdUploadFile, MdOutlineDeleteOutline } from 'react-icons/md';

import { getInputFileBase64 } from '../../../../../../services/tools';

import './Portrait.css';

interface PortraitProps {
    portrait: string;
    readonly: boolean;
    onChange: (base64: string) => void;
}

const allowedMimeTypes = [
    'image/jpeg',
    'image/png'
];

const Portrait: React.FC<PortraitProps> = ({
    portrait,
    readonly,
    onChange
}) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64String = await getInputFileBase64(file);
            onChange(base64String);
        }
    };

    /*
    TODO
    handle when image is smaller than container (position?)
    handle delete button
    when in readonly mode and no portrait -> default image?
    */

    return (
        <Box className="coc-portrait-container">
            <Box className="coc-portrait-inner">
                {portrait ? (
                    <img
                        className="coc-portrait-image"
                        src={portrait}
                        alt="Character Portrait"
                    />
                ) : null}
                {readonly ? null : (
                    <>
                        <label htmlFor="coc-portrait-input">
                            <input
                                id="coc-portrait-input"
                                type="file"
                                accept={allowedMimeTypes.join(',')}
                                onChange={handleFileChange}
                            />
                            <IconButton component="span">
                                <MdUploadFile size={40} />
                            </IconButton>
                        </label>
                        <IconButton color="error" onClick={() => {}}>
                            <MdOutlineDeleteOutline size={40} />
                        </IconButton>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default memo(Portrait);
