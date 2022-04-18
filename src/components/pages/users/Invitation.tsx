import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import {
    Box,
    TextField,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { MdContentCopy } from 'react-icons/md';

import useUser from '../../hooks/useUser';

const Invitation: React.FC = () => {
    const { generateInvitationCode } = useUser();

    const [invitationCode, setInvitationCode] = useState<string>();

    const onCopy = () => {
        if (invitationCode) {
            navigator.clipboard.writeText(invitationCode);
            toast.success('Invitation code copied to clipboard');
        }
    };

    const initialGeneration = useRef<boolean>(false);
    useEffect(() => {
        if (!initialGeneration.current) {
            initialGeneration.current = true;
            (async () => {
                const code = await generateInvitationCode();
                setInvitationCode(code);
            })();
        }
    }, [generateInvitationCode]);

    if (!invitationCode) {
        return <CircularProgress />;
    }

    return (
        <Box className="flex row center-y">
            <TextField
                className="grow"
                value={invitationCode}
                size="small"
                InputProps={{
                    readOnly: true
                }}
            />
            <MdContentCopy
                className="clickable ml-10"
                size={25}
                onClick={onCopy}
            />
        </Box>
    );
};

export default Invitation;
