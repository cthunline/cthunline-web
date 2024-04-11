import { ActionIcon, Grid, Group, Radio } from '@mantine/core';
import { MdClose } from 'react-icons/md';

import './DeathSpiral.css';

interface RadioButtonProps {
    value: number;
    radioCount: number;
    radioValue: number;
    readonly: boolean;
    onChange: (value: number) => void;
}

const RadioButton = ({
    value,
    radioCount,
    radioValue,
    readonly,
    onChange
}: RadioButtonProps) => (
    <Grid.Col span={radioCount === 5 ? 2 : 1}>
        <Group justify="center">
            <Radio
                size={radioCount === 5 ? 'lg' : 'sm'}
                defaultChecked={value >= radioValue}
                value={radioValue}
                onClick={(e) => {
                    if (!readonly) {
                        onChange(Number((e.target as HTMLInputElement).value));
                    }
                }}
            />
        </Group>
    </Grid.Col>
);

interface LabelProps {
    sectionCount: number;
    radioCount: number;
}

const Label = ({ sectionCount, radioCount }: LabelProps) => (
    <Grid.Col
        span={radioCount === 5 ? 2 : 1}
        ta="center"
        py="0.5rem"
        style={{
            fontSize: '1.25rem'
        }}
    >
        {radioCount === 5 ? sectionCount : null}
    </Grid.Col>
);

interface ClearButtonProps {
    readonly: boolean;
    onChange: (value: number) => void;
}

const ClearButton = ({ readonly, onChange }: ClearButtonProps) => (
    <Grid.Col span={2}>
        {!readonly && (
            <Group justify="center">
                <ActionIcon
                    className="death-spiral-clear"
                    size="xs"
                    color="red"
                    onClick={() => {
                        onChange(0);
                    }}
                >
                    <MdClose size={20} />
                </ActionIcon>
            </Group>
        )}
    </Grid.Col>
);

interface DeathSpiralProps {
    value: number;
    readonly: boolean;
    onChange: (value: number) => void;
}

const DeathSpiral = ({ value, readonly, onChange }: DeathSpiralProps) => (
    <Grid
        className="death-spiral"
        w="100%"
        columns={26}
        gutter={0}
        align="center"
    >
        {['radio', 'label']
            .map((rowType) => [
                ...[1, 2, 3, 4]
                    .map((sectionCount) =>
                        [1, 2, 3, 4, 5].map((radioCount) => {
                            const radioValue =
                                (sectionCount - 1) * 5 + radioCount;
                            if (rowType === 'radio') {
                                return (
                                    <RadioButton
                                        key={`deathSpiral-${radioValue.toString()}`}
                                        value={value}
                                        radioCount={radioCount}
                                        radioValue={radioValue}
                                        readonly={readonly}
                                        onChange={onChange}
                                    />
                                );
                            }
                            return (
                                <Label
                                    key={`deathSpiral-label-${sectionCount.toString()}-${radioCount.toString()}`}
                                    radioCount={radioCount}
                                    sectionCount={sectionCount}
                                />
                            );
                        })
                    )
                    .flat(),
                rowType === 'radio' && (
                    <ClearButton
                        key="deathSpiral-clear"
                        readonly={readonly}
                        onChange={onChange}
                    />
                )
            ])
            .flat()}
    </Grid>
);

export default DeathSpiral;
