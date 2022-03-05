import React, {
    useState,
    useEffect,
    useRef
} from 'react';
import { Box, FormControlLabel, Checkbox } from '@mui/material';

import { CoCStatus, CoCCharacterData } from '../../../../../../types/games/callOfCthulhu';
import { CharacterSheetContentProps } from '../../../characterSheetProps';
import { fields } from './status.data';

const Status: React.FC<CharacterSheetContentProps<CoCCharacterData>> = ({
    readonly,
    data,
    onChange
}) => {
    const [status, setStatus] = useState<CoCStatus>(data.status);

    const handleChange = (field: keyof CoCStatus, checked: boolean) => {
        setStatus((previous) => ({
            ...previous,
            [field]: checked
        }));
    };

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            onChange?.({
                ...data,
                status
            });
        }
    }, [
        onChange,
        data,
        status
    ]);

    return (
        <Box display="grid" gridTemplateColumns="repeat(10, 1fr)" gap={2}>
            {fields.map(({ field, label }) => (
                <Box key={field} gridColumn="span 2">
                    <FormControlLabel
                        label={label}
                        labelPlacement="start"
                        control={(
                            <Checkbox
                                disabled={readonly}
                                checked={status[field]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    handleChange(field, e.target.checked);
                                }}
                            />
                        )}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default Status;
