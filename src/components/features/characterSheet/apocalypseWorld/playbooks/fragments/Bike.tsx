import type {
    ApocalypseWorldCharacter,
    ApocalypseWorldCharacterChopperBike
} from '@cthunline/games';
import { Group, Stack, type StackProps } from '@mantine/core';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../../stores/locale.js';
import Textarea from '../../../../../common/Textarea.js';
import SectionTitle from '../../../generic/sectionTitle/SectionTitle.js';

interface BikeProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'chopper'>) => void;
}

const Bike = ({ readonly, character, onChange, ...props }: BikeProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onBikeValueChange = (
        data: Partial<ApocalypseWorldCharacterChopperBike>
    ) => {
        onChange?.({
            chopper: {
                ...character.chopper,
                bike: {
                    ...character.chopper.bike,
                    ...data
                }
            }
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <SectionTitle
                iconBefore={<GiFullMotorcycleHelmet size={20} />}
                text={T('game.apocalypseWorld.playbooks.chopper.bike.title')}
            />
            <Group gap="1rem" w="100%">
                {(['strengths', 'looks', 'weaknesses'] as const).map(
                    (field) => (
                        <Textarea
                            key={`chopper-bike-${field}`}
                            variant="contained"
                            flex="1 0"
                            rows={6}
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                `game.apocalypseWorld.playbooks.chopper.bike.${field}`
                            )}
                            value={character.chopper.bike[field]}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                                onBikeValueChange({
                                    [field]: e.target.value
                                });
                            }}
                        />
                    )
                )}
            </Group>
        </Stack>
    );
};

export default Bike;
