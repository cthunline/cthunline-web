import { Checkbox, Group, Stack, Text } from '@mantine/core';
import { GiSkills } from 'react-icons/gi';
import {
    type ApocalypseWorldCharacter,
    type ApocalypseWorldStats,
    apocalypseWorld
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import TextInput from '../../../../common/TextInput.js';

interface StatsProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (data: ApocalypseWorldStats) => void;
}

const Stats = ({ readonly, character, onChange }: StatsProps) => {
    const { T } = useApp();

    const onStatChange = (stats: Partial<ApocalypseWorldStats>) => {
        onChange({
            ...character.stats,
            ...stats
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiSkills size={20} />}
                text={T('game.apocalypseWorld.stats.title')}
            />
            <Group
                w="100%"
                justify="space-between"
                align="start"
                flex="0 0 auto"
            >
                {apocalypseWorld.data.stats.map((stat) => (
                    <Stack gap="0.5rem" key={`stat-${stat}`}>
                        <Text>
                            {T(`game.apocalypseWorld.stats.${stat}.name`)}
                        </Text>
                        <Group gap="0.5rem">
                            <TextInput
                                variant="contained"
                                w="5rem"
                                readOnly={readonly}
                                size="sm"
                                value={character.stats[stat].value}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    onStatChange({
                                        [stat]: {
                                            ...character.stats[stat],
                                            value: e.target.value
                                        }
                                    });
                                }}
                            />
                            <Checkbox
                                defaultChecked={
                                    character.stats[stat].highlighted
                                }
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    if (!readonly) {
                                        onStatChange({
                                            [stat]: {
                                                ...character.stats[stat],
                                                highlighted: e.target.checked
                                            }
                                        });
                                    }
                                }}
                            />
                        </Group>
                        <Text
                            fz="0.75rem"
                            maw="6.5rem"
                            style={{ wordBreak: 'break-word' }}
                        >
                            {T(
                                `game.apocalypseWorld.stats.${stat}.description`
                            )}
                        </Text>
                    </Stack>
                ))}
            </Group>
        </Stack>
    );
};

export default Stats;
