import { Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { GiSpikedArmor } from 'react-icons/gi';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyArmourPoints
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { onlyNumbers } from '../../../../../services/tools';
import { useApp } from '../../../../contexts/App';

interface ArmourPointsInputProps {
    readonly: boolean;
    label?: string;
    value: number;
    onChange?: (value: number) => void;
}

const ArmourPointsInput = ({
    readonly,
    label,
    value,
    onChange
}: ArmourPointsInputProps) => (
    <TextField
        fullWidth
        InputProps={{
            readOnly: readonly,
            classes: {
                input: 'input-smaller-text'
            }
        }}
        sx={{ input: { textAlign: 'center' } }}
        type="text"
        size="small"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(Number(onlyNumbers(e.target.value)));
        }}
    />
);

interface ArmourPointsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        armourPoints: Pick<WarhammerFantasyCharacter, 'armourPoints'>
    ) => void;
    flex?: string | number;
}

const ArmourPoints = ({
    readonly,
    character,
    onChange,
    flex
}: ArmourPointsProps) => {
    const { T } = useApp();

    const onArmourPointsChange = (
        key: keyof WarhammerFantasyArmourPoints,
        value: number
    ) => {
        onChange({
            armourPoints: {
                ...character.armourPoints,
                [key]: value
            }
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiSpikedArmor size={20} />}
                text={T('game.warhammerFantasy.common.armourPoints')}
            />
            <Grid container columns={3} spacing={2}>
                <Grid xs={1} />
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.head')}
                        value={character.armourPoints.head}
                        onChange={(value: number) => {
                            onArmourPointsChange('head', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} />
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.rightArm')}
                        value={character.armourPoints.rightArm}
                        onChange={(value: number) => {
                            onArmourPointsChange('rightArm', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.body')}
                        value={character.armourPoints.body}
                        onChange={(value: number) => {
                            onArmourPointsChange('body', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.leftArm')}
                        value={character.armourPoints.leftArm}
                        onChange={(value: number) => {
                            onArmourPointsChange('leftArm', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.rightLeg')}
                        value={character.armourPoints.rightLeg}
                        onChange={(value: number) => {
                            onArmourPointsChange('rightLeg', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.shield')}
                        value={character.armourPoints.shield}
                        onChange={(value: number) => {
                            onArmourPointsChange('shield', value);
                        }}
                    />
                </Grid>
                <Grid xs={1} display="flex" alignItems="center">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.leftLeg')}
                        value={character.armourPoints.leftLeg}
                        onChange={(value: number) => {
                            onArmourPointsChange('leftLeg', value);
                        }}
                    />
                </Grid>
            </Grid>
        </Stack>
    );
};

export default ArmourPoints;
