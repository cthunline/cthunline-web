import React from 'react';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { toast } from 'react-toastify';
import { HiMusicNote } from 'react-icons/hi';
import { MdUploadFile, MdOutlineDeleteOutline } from 'react-icons/md';
import { GrImage } from 'react-icons/gr';

import { useDialog } from '../../contexts/Dialog';
import useAsset from '../../hooks/useAsset';

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'audio/mpeg'
];

const limitSizeInMb = 10;

const Assets: React.FC = () => {
    const { confirmDialog } = useDialog();
    const {
        assetList,
        uploadAsset,
        deleteAsset
    } = useAsset({
        loadList: true
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const sizeInMb = file.size / 1000000;
            if (sizeInMb > limitSizeInMb) {
                toast.error(`File size is too large (max ${limitSizeInMb}Mb)`);
            } else {
                uploadAsset({ file });
            }
        }
    };

    const onDelete = (assetId: string, name: string) => {
        confirmDialog(`Delete asset ${name} ?`, () => {
            deleteAsset({ assetId });
        });
    };

    return (
        <Paper elevation={3} className="page-list box flex column start">
            <Typography variant="h6" gutterBottom>
                Assets
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assetList.map(({
                            id,
                            type,
                            name
                        }) => (
                            <TableRow key={id}>
                                <TableCell>
                                    {type === 'audio' ? (
                                        <HiMusicNote />
                                    ) : (
                                        <GrImage />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {name}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="medium"
                                        color="error"
                                        onClick={() => onDelete(id, name)}
                                    >
                                        <MdOutlineDeleteOutline />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <label className="create-button" htmlFor="assets-input">
                <input
                    id="assets-input"
                    className="hidden"
                    type="file"
                    accept={allowedMimeTypes.join(',')}
                    onChange={handleFileChange}
                />
                <Button
                    variant="contained"
                    size="medium"
                    component="span"
                    startIcon={<MdUploadFile />}
                >
                    Upload
                </Button>
            </label>
        </Paper>
    );
};

export default Assets;