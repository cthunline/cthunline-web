import React, { memo } from 'react';
import {
    Box
    // TextField,
    // Checkbox,
    // IconButton
} from '@mui/material';
// import { MdOutlineDeleteOutline } from 'react-icons/md';

// import { CoCWeapon } from '../../../../../../types/games/callOfCthulhu';
// import { skillKeys } from './skills.data';
// import { controlSkill } from './skills.helper';

interface WeaponProps {
    // index: number;
    // data: CoCWeapon;
    // readonly: boolean;
    // onChange: (index: number, data: CoCWeapon) => void;
    // onDelete: (index: number) => void;
}
/*
"name" : "Unarmed",
"damage" : "1D3 + DB",
"attacks" : "1",
"range" : "",
"ammo" : "",
"malfunction" : 0
*/

/*
{
    index,
    data,
    readonly,
    onChange,
    onDelete
}
*/
const Weapon: React.FC<WeaponProps> = () => (
    <Box
        gridColumn="span 12"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
    >
        {/* <Box gridColumn="span 5" display="grid" alignItems="center">
            {data.name}
        </Box>
        <Box gridColumn="span 2" display="grid" alignItems="center">
            <TextField
                fullWidth
                InputProps={{
                    readOnly: readonly
                }}
                type="text"
                size="small"
                label="Base"
                value={data.base}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange(
                        index,
                        controlSkill({
                            ...data,
                            base: e.target.value
                        })
                    );
                }}
            />
        </Box>
        {skillKeys.map(({ key, label, editable }) => (
            <Box
                key={key.toString()}
                gridColumn="span 1"
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
                    label={label}
                    value={data[key]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(
                            index,
                            controlSkill({
                                ...data,
                                [key]: Number(e.target.value)
                            })
                        );
                    }}
                />
            </Box>
        ))}
        <Box gridColumn="span 1" alignItems="center">
            <IconButton
                size="medium"
                color="error"
                onClick={() => onDelete(index)}
            >
                <MdOutlineDeleteOutline />
            </IconButton>
        </Box> */}
    </Box>
);

export default memo(Weapon);
