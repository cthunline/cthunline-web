import { GiSwissArmyKnife } from 'react-icons/gi';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyTrapping
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import AddTrappingRow from './AddTrappingRow';
import TrappingRow from './TrappingRow';

interface TrappingsProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (trappings: Pick<WarhammerFantasyCharacter, 'trappings'>) => void;
}

const Trappings = ({ readonly, character, onChange }: TrappingsProps) => {
    const { T } = useApp();

    const onTrappingChange = (
        index: number,
        trapping: WarhammerFantasyTrapping
    ) => {
        onChange({
            trappings: character.trappings.map((tal, idx) =>
                index === idx ? trapping : tal
            )
        });
    };

    const onTrappingCreate = (trapping: WarhammerFantasyTrapping) => {
        onChange({
            trappings: [...character.trappings, trapping]
        });
    };

    const onTrappingDelete = (index: number) => {
        onChange({
            trappings: character.trappings.filter(
                (_trapping, idx) => index !== idx
            )
        });
    };

    return (
        <Stack direction="column" gap="0.5rem" flex={1}>
            <SectionTitle
                iconBefore={<GiSwissArmyKnife size={20} />}
                text={T('game.warhammerFantasy.common.trappings')}
            />
            <Grid container columns={readonly ? 8 : 9} spacing={2}>
                {character.trappings.map((trapping, index) => (
                    <TrappingRow
                        key={`trapping-row-${index.toString()}`}
                        readonly={readonly}
                        trapping={trapping}
                        onChange={(tal: WarhammerFantasyTrapping) => {
                            onTrappingChange(index, tal);
                        }}
                        onDelete={() => {
                            onTrappingDelete(index);
                        }}
                    />
                ))}
                {!readonly && <AddTrappingRow onCreate={onTrappingCreate} />}
            </Grid>
        </Stack>
    );
};

export default Trappings;
