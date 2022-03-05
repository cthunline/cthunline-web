import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, TextField } from '@mui/material';

import { CoCSanity } from '../../../../../../types/games/callOfCthulhu';
import { sanityKeys } from './characteristics.data';
import { controlSanity } from './characteristics.helper';

interface SanityProps {
    data: CoCSanity;
    readonly: boolean;
    handleChange: (data: CoCSanity) => void;
}

const Sanity: React.FC<SanityProps> = ({
    data,
    readonly,
    handleChange
}) => {
    const [sanity, setSanity] = useState<CoCSanity>(data);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            handleChange(sanity);
        }
    }, [
        handleChange,
        sanity
    ]);

    return (
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box gridColumn="span 3" display="grid" alignItems="center">
                Sanity
            </Box>
            {sanityKeys.map(({ key, label: keyLabel, editable }) => (
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
                        value={sanity[key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSanity((previous) => (
                                controlSanity({
                                    ...previous,
                                    [key]: Number(e.target.value)
                                })
                            ));
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Sanity;
