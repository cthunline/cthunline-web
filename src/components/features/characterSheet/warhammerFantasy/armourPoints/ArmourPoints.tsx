import { GiSpikedArmor } from 'react-icons/gi';
import { Grid, Stack } from '@mantine/core';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyArmourPoints
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../contexts/App.js';

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
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        ta="center"
        size="sm"
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
    flex: string | number;
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
        <Stack gap="0.5rem" flex={flex}>
            <SectionTitle
                iconBefore={<GiSpikedArmor size={20} />}
                text={T('game.warhammerFantasy.common.armourPoints')}
            />
            <Grid columns={3} gutter="0.25rem">
                <Grid.Col span={1} />
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.head')}
                        value={character.armourPoints.head}
                        onChange={(value: number) => {
                            onArmourPointsChange('head', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} />
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.rightArm')}
                        value={character.armourPoints.rightArm}
                        onChange={(value: number) => {
                            onArmourPointsChange('rightArm', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.body')}
                        value={character.armourPoints.body}
                        onChange={(value: number) => {
                            onArmourPointsChange('body', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.leftArm')}
                        value={character.armourPoints.leftArm}
                        onChange={(value: number) => {
                            onArmourPointsChange('leftArm', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.rightLeg')}
                        value={character.armourPoints.rightLeg}
                        onChange={(value: number) => {
                            onArmourPointsChange('rightLeg', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.shield')}
                        value={character.armourPoints.shield}
                        onChange={(value: number) => {
                            onArmourPointsChange('shield', value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1} display="flex">
                    <ArmourPointsInput
                        readonly={readonly}
                        label={T('game.warhammerFantasy.armourPoints.leftLeg')}
                        value={character.armourPoints.leftLeg}
                        onChange={(value: number) => {
                            onArmourPointsChange('leftLeg', value);
                        }}
                    />
                </Grid.Col>
            </Grid>
        </Stack>
    );
};

export default ArmourPoints;
