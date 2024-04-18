import { GiDeathSkull, GiGothicCross, GiStoneCrafting } from 'react-icons/gi';
import { ActionIcon, Group, Menu, Text } from '@mantine/core';
import { type IconType } from 'react-icons';
import { FaBan, FaShield } from 'react-icons/fa6';

import { useApp } from '../../../../contexts/App.js';

type CareerLevelData = {
    level: number;
    IconComponent: IconType;
    color: string;
};

const careerLevelsMap = new Map<number, CareerLevelData>([
    [
        1,
        {
            level: 1,
            IconComponent: GiGothicCross,
            color: 'var(--palette-gray)'
        }
    ],
    [
        2,
        {
            level: 2,
            IconComponent: GiStoneCrafting,
            color: 'var(--palette-bronze)'
        }
    ],
    [
        3,
        {
            level: 3,
            IconComponent: GiDeathSkull,
            color: 'var(--palette-silver)'
        }
    ],
    [
        4,
        {
            level: 4,
            IconComponent: FaShield,
            color: 'var(--palette-gold)'
        }
    ]
]);

interface CareerLevelButtonProps {
    level?: number;
    onChange?: (level: number | undefined) => void;
    readonly?: boolean;
}

const CareerLevelButton = ({
    level,
    onChange,
    readonly
}: CareerLevelButtonProps) => {
    const { T } = useApp();
    const careerLevelData = level ? careerLevelsMap.get(level) : undefined;

    if (readonly) {
        return (
            careerLevelData?.IconComponent && (
                <careerLevelData.IconComponent
                    size="0.75rem"
                    color={careerLevelData.color}
                />
            )
        );
    }

    return (
        <Menu>
            <Menu.Target>
                <ActionIcon size="xs" color={careerLevelData?.color ?? 'gray'}>
                    {careerLevelData?.IconComponent && (
                        <careerLevelData.IconComponent
                            size="0.75rem"
                            color="var(--mantine-color-dark-8)"
                        />
                    )}
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item onClick={() => onChange?.(undefined)}>
                    <Group gap="0.5rem">
                        <Text fz="0.875rem" flex="1 0">
                            {T('action.clear')}
                        </Text>
                        <FaBan size="0.875rem" />
                    </Group>
                </Menu.Item>
                {[...careerLevelsMap].map(
                    ([, { level: lvl, IconComponent, color }]) => (
                        <Menu.Item
                            key={`career-level-item-${lvl}`}
                            color={color}
                            onClick={() => onChange?.(lvl)}
                        >
                            <Group gap="0.5rem">
                                <Text fz="0.875rem" flex="1 0">
                                    {T(
                                        'game.warhammerFantasy.characteristic.careerLevel'
                                    )}
                                    &nbsp;
                                    {lvl}
                                </Text>
                                <IconComponent size="0.875rem" />
                            </Group>
                        </Menu.Item>
                    )
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default CareerLevelButton;
