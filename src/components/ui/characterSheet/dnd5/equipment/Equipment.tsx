import { Box, TextField } from '@mui/material';
import { DnD5Equipment } from '@cthunline/games';

import { useApp } from '../../../../contexts/App';
import { onlyNumbers } from '../../../../../services/tools';
import { moneyFields, equipmentFields } from './equipment.data';

interface EquipmentProps {
    equipment: DnD5Equipment;
    readonly: boolean;
    onChange: (data: Partial<DnD5Equipment>) => void;
}

const Equipment = ({ equipment, readonly, onChange }: EquipmentProps) => {
    const { T } = useApp();

    return (
        <Box
            gridColumn="span 12"
            display="grid"
            gridTemplateColumns="repeat(10, 1fr)"
            alignItems="center"
            gap={2}
        >
            {[
                ...moneyFields.map((money) => {
                    const value = equipment.money[money];
                    return (
                        <Box key={`equipment-${money}`} gridColumn="span 2">
                            <TextField
                                fullWidth
                                InputProps={{
                                    readOnly: readonly,
                                    classes: {
                                        input: 'input-smaller-text'
                                    }
                                }}
                                type="text"
                                size="small"
                                label={T(`game.dnd5.equipment.${money}`)}
                                value={value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onChange({
                                        money: {
                                            ...equipment.money,
                                            [money]: Number(
                                                onlyNumbers(e.target.value)
                                            )
                                        }
                                    });
                                }}
                            />
                        </Box>
                    );
                }),
                ...equipmentFields.map((key) => (
                    <Box key={`equipment-${key}`} gridColumn="span 5">
                        <TextField
                            fullWidth
                            multiline
                            minRows={5}
                            maxRows={5}
                            InputProps={{
                                readOnly: readonly,
                                classes: {
                                    input: 'input-smaller-text'
                                }
                            }}
                            type="text"
                            size="small"
                            label={T(`game.dnd5.equipment.${key}`)}
                            value={equipment[key]}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange({
                                    [key]: e.target.value
                                });
                            }}
                        />
                    </Box>
                ))
            ]}
        </Box>
    );
};

export default Equipment;
