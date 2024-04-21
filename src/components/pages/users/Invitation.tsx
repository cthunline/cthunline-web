import { ActionIcon, CopyButton, Group, Input, Loader } from '@mantine/core';
import { MdCheck, MdContentCopy } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

import useUser from '../../../hooks/api/useUser.js';

const Invitation = () => {
    const { generateInvitationCode } = useUser();

    const [invitationCode, setInvitationCode] = useState<string>();

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
        return <Loader />;
    }

    return (
        <Group justify="center">
            <Input value={invitationCode} readOnly flex={1} />
            <CopyButton value={invitationCode}>
                {({ copied, copy }) => (
                    <ActionIcon
                        onClick={copy}
                        color={copied ? 'green' : undefined}
                    >
                        {copied ? <MdCheck /> : <MdContentCopy />}
                    </ActionIcon>
                )}
            </CopyButton>
        </Group>
    );
};

export default Invitation;
