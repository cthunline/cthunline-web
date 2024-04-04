import { ActionIcon, Box, Group, type GroupProps } from '@mantine/core';
import { type WarhammerFantasyCharacter } from '@cthunline/games';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { GiOrbDirection } from 'react-icons/gi';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';

export interface AdvantageProps extends Omit<GroupProps, 'onChange'> {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (
        partialChar: Pick<WarhammerFantasyCharacter, 'advantage'>
    ) => void;
}

const Advantage = ({
    readonly,
    character,
    onChange,
    ...props
}: AdvantageProps) => {
    const { T } = useApp();

    const handleChange = (action: 'increase' | 'decrease') => {
        if (!readonly) {
            if (action === 'increase') {
                onChange({
                    advantage: character.advantage + 1
                });
            } else if (action === 'decrease' && character.advantage > 0) {
                onChange({
                    advantage: character.advantage - 1
                });
            }
        }
    };

    return (
        <Group {...props}>
            <SectionTitle
                iconBefore={<GiOrbDirection size={20} />}
                text={T('game.warhammerFantasy.common.advantage')}
            />
            <Group flex="1 0" gap="0.5rem">
                {!readonly && (
                    <ActionIcon onClick={() => handleChange('decrease')}>
                        <FaMinus />
                    </ActionIcon>
                )}
                <Box miw="2.5rem" ta="center">
                    {character.advantage}
                </Box>
                {!readonly && (
                    <ActionIcon onClick={() => handleChange('increase')}>
                        <FaPlus />
                    </ActionIcon>
                )}
            </Group>
        </Group>
    );
};

export default Advantage;
