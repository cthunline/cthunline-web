import { Box, IconButton, Stack, type StackProps } from '@mui/material';
import { type WarhammerFantasyCharacter } from '@cthunline/games';
import { GiOrbDirection } from 'react-icons/gi';
import { FaPlus, FaMinus } from 'react-icons/fa6';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';

export interface AdvantageProps extends Omit<StackProps, 'onChange'> {
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
        if (action === 'increase') {
            onChange({
                advantage: character.advantage + 1
            });
        } else if (action === 'decrease' && character.advantage > 0) {
            onChange({
                advantage: character.advantage - 1
            });
        }
    };

    return (
        <Stack direction="row" alignItems="center" {...props}>
            <SectionTitle
                iconBefore={<GiOrbDirection size={20} />}
                text={T('game.warhammerFantasy.common.advantage')}
            />
            <Stack
                direction="row"
                flex={1}
                gap="0.5rem"
                alignItems="center"
                justifyContent="end"
            >
                <IconButton
                    size="small"
                    onClick={() => handleChange('decrease')}
                >
                    <FaMinus />
                </IconButton>
                <Box minWidth="2.5rem" textAlign="center">
                    {character.advantage}
                </Box>
                <IconButton
                    size="small"
                    onClick={() => handleChange('increase')}
                >
                    <FaPlus />
                </IconButton>
            </Stack>
        </Stack>
    );
};

export default Advantage;
