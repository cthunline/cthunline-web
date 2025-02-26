import type {
    ApocalypseWorldCharacter,
    ApocalypseWorldCharacterDriverCar
} from '@cthunline/games';
import { Group, Stack, type StackProps } from '@mantine/core';
import { GiDarkSquad } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../../stores/locale.js';
import TextInput from '../../../../../common/TextInput.js';
import Textarea from '../../../../../common/Textarea.js';
import SectionTitle from '../../../generic/sectionTitle/SectionTitle.js';

const defaultCar: ApocalypseWorldCharacterDriverCar = {
    frame: '',
    power: '',
    looks: '',
    armor: '',
    weak: '',
    tags: ''
};

interface CarProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    title: string;
    car: ApocalypseWorldCharacterDriverCar;
    onChange?: (data: ApocalypseWorldCharacterDriverCar) => void;
}

const Car = ({ readonly, title, car, onChange, ...props }: CarProps) => {
    const T = useLocaleStore(({ T }) => T);

    const onCarValueChange = (
        data: Partial<ApocalypseWorldCharacterDriverCar>
    ) => {
        onChange?.({
            ...car,
            ...data
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <SectionTitle iconBefore={<GiDarkSquad size={20} />} text={title} />
            <Group gap="1rem" w="100%" align="start">
                <Stack gap="1rem" w="16rem">
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly}
                        size="sm"
                        label={T(
                            'game.apocalypseWorld.playbooks.driver.car.frame'
                        )}
                        value={car.frame}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onCarValueChange({
                                frame: e.target.value
                            });
                        }}
                    />
                    <Group gap="1rem" w="100%">
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.driver.car.power'
                            )}
                            value={car.power}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onCarValueChange({
                                    power: e.target.value
                                });
                            }}
                        />
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.driver.car.looks'
                            )}
                            value={car.looks}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onCarValueChange({
                                    looks: e.target.value
                                });
                            }}
                        />
                    </Group>
                    <Group gap="1rem" w="100%">
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.driver.car.armor'
                            )}
                            value={car.armor}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onCarValueChange({
                                    armor: e.target.value
                                });
                            }}
                        />
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.driver.car.weak'
                            )}
                            value={car.weak}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onCarValueChange({
                                    weak: e.target.value
                                });
                            }}
                        />
                    </Group>
                </Stack>
                <Textarea
                    variant="contained"
                    flex="1 0"
                    rows={6}
                    readOnly={readonly}
                    size="sm"
                    label={T('game.apocalypseWorld.playbooks.driver.car.tags')}
                    value={car.tags}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onCarValueChange({
                            tags: e.target.value
                        });
                    }}
                />
            </Group>
        </Stack>
    );
};

interface CarsProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'driver'>) => void;
}

const Cars = ({ readonly, character, onChange, ...props }: CarsProps) => {
    const T = useLocaleStore(({ T }) => T);

    const characterCars = character.driver.cars;
    const cars = [
        characterCars[0] ?? defaultCar,
        characterCars[1] ?? defaultCar,
        characterCars[2] ?? defaultCar
    ];

    const onCarChange = (
        index: number,
        data: ApocalypseWorldCharacterDriverCar
    ) => {
        const updatedCars = [...cars];
        updatedCars[index] = data;
        onChange?.({
            driver: {
                ...character.driver,
                cars: updatedCars
            }
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <Car
                readonly={readonly}
                title={T('game.apocalypseWorld.playbooks.driver.yourCar')}
                car={cars[0]}
                onChange={(data: ApocalypseWorldCharacterDriverCar) => {
                    onCarChange(0, data);
                }}
            />
            <Car
                readonly={readonly}
                title={T('game.apocalypseWorld.playbooks.driver.car2')}
                car={cars[1]}
                onChange={(data: ApocalypseWorldCharacterDriverCar) => {
                    onCarChange(1, data);
                }}
            />
            <Car
                readonly={readonly}
                title={T('game.apocalypseWorld.playbooks.driver.car3')}
                car={cars[2]}
                onChange={(data: ApocalypseWorldCharacterDriverCar) => {
                    onCarChange(2, data);
                }}
            />
        </Stack>
    );
};

export default Cars;
