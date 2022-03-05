import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, TextField } from '@mui/material';

import { CoCLuck } from '../../../../../../types/games/callOfCthulhu';
import { luckKeys } from './characteristics.data';

interface LuckProps {
    data: CoCLuck;
    readonly: boolean;
    handleChange: (data: CoCLuck) => void;
}

const Luck: React.FC<LuckProps> = ({
    data,
    readonly,
    handleChange
}) => {
    const [luck, setLuck] = useState<CoCLuck>(data);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            handleChange(luck);
        }
    }, [
        handleChange,
        luck
    ]);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box gridColumn="span 3" display="grid" alignItems="center">
                Luck
            </Box>
            {luckKeys.map(({ key, label: keyLabel, editable }) => (
                <Box
                    key={key.toString()}
                    gridColumn="span 3"
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        disabled={!editable}
                        InputProps={{
                            readOnly: readonly
                        }}
                        type="text"
                        size="small"
                        label={keyLabel}
                        value={luck[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setLuck((previous) => ({
                                ...previous,
                                [key]: Number(e.target.value)
                            }));
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Luck;
