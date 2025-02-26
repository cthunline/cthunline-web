import type { AlienConditions, AlienStatus } from '@cthunline/games';
import { Group, Stack } from '@mantine/core';
import { GiRelationshipBounds } from 'react-icons/gi';

import { useLocaleStore } from '../../../../../stores/locale.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import {
    conditionsFields,
    criticalInjuriesFields,
    statusFields
} from '../fields.js';

type StatusProps = {
    status: AlienStatus;
    flex?: string | number;
    readonly: boolean;
    onChange: (status: AlienStatus) => void;
};

const Status = ({ status, flex, readonly, onChange }: StatusProps) => {
    const T = useLocaleStore(({ T }) => T);
    return (
        <Stack flex={flex}>
            <SectionTitle
                iconBefore={<GiRelationshipBounds size={20} />}
                text={T('game.alien.status.status')}
            />
            <Group w="100%" align="start" gap="2rem">
                <Stack flex="1 0">
                    <FieldLayout<AlienStatus>
                        gameId="alien"
                        fields={statusFields.slice(0, 2)}
                        textSectionKey="status"
                        data={status}
                        readonly={readonly}
                        onChange={(status: AlienStatus) => {
                            onChange(status);
                        }}
                    />
                </Stack>
                <Stack flex="1 0">
                    <FieldLayout<AlienStatus>
                        gameId="alien"
                        fields={statusFields.slice(2, 4)}
                        textSectionKey="status"
                        data={status}
                        readonly={readonly}
                        onChange={(status: AlienStatus) => {
                            onChange(status);
                        }}
                    />
                </Stack>
                <Stack flex="1 0">
                    <FieldLayout<AlienConditions>
                        gameId="alien"
                        fields={conditionsFields.slice(0, 2)}
                        textSectionKey="status.conditions"
                        data={status.conditions}
                        readonly={readonly}
                        onChange={(conditions: AlienConditions) => {
                            onChange({
                                ...status,
                                conditions
                            });
                        }}
                    />
                </Stack>
                <Stack flex="1 0">
                    <FieldLayout<AlienConditions>
                        gameId="alien"
                        fields={conditionsFields.slice(2, 4)}
                        textSectionKey="status.conditions"
                        data={status.conditions}
                        readonly={readonly}
                        onChange={(conditions: AlienConditions) => {
                            onChange({
                                ...status,
                                conditions
                            });
                        }}
                    />
                </Stack>
                <FieldLayout<AlienStatus>
                    flex="3 0"
                    gameId="alien"
                    fields={criticalInjuriesFields}
                    textSectionKey="status"
                    data={status}
                    readonly={readonly}
                    onChange={(status: AlienStatus) => {
                        onChange(status);
                    }}
                />
            </Group>
        </Stack>
    );
};

export default Status;
