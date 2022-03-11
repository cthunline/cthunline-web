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
import { HiMusicNote } from 'react-icons/hi';
import { MdUploadFile, MdOutlineDeleteOutline } from 'react-icons/md';
import { GrImage } from 'react-icons/gr';

import { useDialog } from '../../contexts/Dialog';
import useAsset from '../../hooks/useAsset';

const Assets: React.FC = () => {
    const { confirmDialog } = useDialog();
    const {
        assetList,
        // uploadAsset,
        deleteAsset
    } = useAsset({
        loadList: true
    });

    const onUpload = () => {
        // TODO
    };

    const onDelete = (assetId: string, name: string) => {
        confirmDialog(`Delete asset ${name} ?`, () => {
            deleteAsset({
                assetId
            });
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
            <Button
                className="create-button"
                variant="contained"
                size="medium"
                startIcon={<MdUploadFile />}
                onClick={onUpload}
            >
                Upload
            </Button>
        </Paper>
    );
};

export default Assets;
