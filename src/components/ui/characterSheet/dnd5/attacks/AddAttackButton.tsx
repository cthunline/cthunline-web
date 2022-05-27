import React, { memo } from 'react';
import { IconButton } from '@mui/material';
import { FiPlusCircle } from 'react-icons/fi';
import { DnD5Attack } from '@cthunline/games';

import { defaultAttack } from './attacks.data';

interface AttacksProps {
    onCreate: (data: DnD5Attack) => void;
}

const AddAttackButton: React.FC<AttacksProps> = ({ onCreate }) => (
    <IconButton
        size="medium"
        onClick={() => {
            onCreate(defaultAttack);
        }}
    >
        <FiPlusCircle />
    </IconButton>
);

export default memo(AddAttackButton);
