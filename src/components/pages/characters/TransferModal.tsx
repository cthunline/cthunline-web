import { useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    type SelectChangeEvent
} from '@mui/material';

import { type SelectorOption } from '../../ui/selector/Selector';
import { useApp } from '../../contexts/App';
import useUser from '../../hooks/useUser';
import { Selector } from '../../ui';

export interface TransferData {
    characterId: number;
    userId: number;
}

interface TransferModalProps {
    open: boolean;
    characterId: number;
    onConfirm: (data: TransferData) => void;
    onClose: () => void;
}

interface TransferUserSelectData {
    userId: number | null;
    requiredError: boolean;
}

const TransferModal = ({
    open,
    characterId,
    onConfirm,
    onClose
}: TransferModalProps) => {
    const { userList } = useUser({ loadList: true });
    const { T } = useApp();

    const [userSelectData, setUserSelectData] =
        useState<TransferUserSelectData>({
            userId: null,
            requiredError: false
        });

    const userOptions: SelectorOption[] = useMemo(
        () =>
            userList.map(({ id, name }) => ({
                value: id,
                name
            })),
        [userList]
    );

    const onUserChange = (e: SelectChangeEvent) => {
        const stringValue = e.target.value;
        setUserSelectData({
            userId: stringValue ? Number(stringValue) : null,
            requiredError: !stringValue
        });
    };

    const onConfirmClick = () => {
        if (userSelectData.userId) {
            onConfirm?.({
                characterId,
                userId: userSelectData.userId
            });
            onClose?.();
        } else {
            setUserSelectData({
                userId: null,
                requiredError: true
            });
        }
    };

    return (
        <Dialog
            PaperProps={{
                className: 'custom-dialog'
            }}
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{T('page.characters.selectTransferUser')}</DialogTitle>
            <DialogContent>
                <Selector
                    name="transfer-user"
                    label={T('entity.user')}
                    options={userOptions}
                    value={userSelectData.userId?.toString()}
                    onChange={onUserChange}
                    error={
                        userSelectData.requiredError
                            ? T('common.required')
                            : undefined
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{T('action.cancel')}</Button>
                <Button onClick={onConfirmClick}>{T('action.confirm')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransferModal;
