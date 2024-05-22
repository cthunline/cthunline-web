import { type ApocalypseWorldCharacter } from '@cthunline/games';
import { Checkbox, Group, Stack } from '@mantine/core';
import { GiHealthNormal } from 'react-icons/gi';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../contexts/App.js';
import HarmPie from './HarmPie.js';

interface HarmProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (data: Pick<ApocalypseWorldCharacter, 'harm'>) => void;
}

type HarmStatus =
    | 'stabilized'
    | 'shattered'
    | 'crippled'
    | 'disfigured'
    | 'broken';

const harmStatus: HarmStatus[] = [
    'stabilized',
    'shattered',
    'crippled',
    'disfigured',
    'broken'
];

const Harm = ({ readonly, character, onChange }: HarmProps) => {
    const { T } = useApp();

    const onStatusChange = (status: HarmStatus, checked: boolean) => {
        if (!readonly) {
            onChange({
                harm: {
                    ...character.harm,
                    [status]: checked
                }
            });
        }
    };

    const onHarmCountdownChange = (val: number) => {
        onChange({
            harm: {
                ...character.harm,
                countdown: val
            }
        });
    };

    return (
        <Group gap="1rem" w="100%" align="start" justify="start">
            <Stack gap="1rem" flex="1 0">
                <SectionTitle
                    iconBefore={<GiHealthNormal size={20} />}
                    text={T('game.apocalypseWorld.harm.title')}
                />
                {harmStatus.map((status) => (
                    <Checkbox
                        key={`harm-status-${status}`}
                        label={T(`game.apocalypseWorld.harm.${status}`)}
                        checked={!!character.harm[status]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!readonly) {
                                onStatusChange(status, e.target.checked);
                            }
                        }}
                    />
                ))}
            </Stack>
            <Stack gap="1rem" flex="1 0">
                <HarmPie
                    readonly={readonly}
                    value={character.harm.countdown}
                    onChange={onHarmCountdownChange}
                    onClear={() => onHarmCountdownChange(0)}
                    size="8rem"
                />
            </Stack>
        </Group>
    );
};

export default Harm;
