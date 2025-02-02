import type { AlienConditions, AlienStatus } from '@cthunline/games';
import { Group, Stack } from '@mantine/core';
import { GiRelationshipBounds } from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
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
    const { T } = useApp();
    return (
        <Stack flex={flex}>
            <SectionTitle
                iconBefore={<GiRelationshipBounds size={20} />}
                text={T('game.alien.status.status')}
            />
            <Group w="100%" align="start" gap="2rem">
                <Stack flex="2 0">
                    <FieldLayout<AlienStatus>
                        gameId="alien"
                        fields={statusFields}
                        textSectionKey="status"
                        data={status}
                        readonly={readonly}
                        onChange={(status: AlienStatus) => {
                            onChange(status);
                        }}
                    />
                </Stack>
                <Stack flex="3 0">
                    <FieldLayout<AlienConditions>
                        gameId="alien"
                        fields={conditionsFields}
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
            </Group>
            <FieldLayout<AlienStatus>
                gameId="alien"
                fields={criticalInjuriesFields}
                textSectionKey="status"
                data={status}
                readonly={readonly}
                onChange={(status: AlienStatus) => {
                    onChange(status);
                }}
            />
        </Stack>
    );
};

export default Status;
