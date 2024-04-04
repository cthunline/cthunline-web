import { type WarhammerFantasyTalent } from '@cthunline/games';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { ActionIcon, Box, Group } from '@mantine/core';

import { onlyNumbers } from '../../../../../services/tools';
import TextInput from '../../../../common/TextInput';
import { useApp } from '../../../../contexts/App';

type TalentRowInputProps = {
    readonly: boolean;
    label?: string;
} & (
    | {
          type: 'string';
          value: string;
          onChange?: (value: string) => void;
      }
    | {
          type: 'number';
          value: number;
          onChange?: (value: number) => void;
      }
);

const TalentRowInput = ({
    readonly,
    type,
    label,
    value,
    onChange
}: TalentRowInputProps) => (
    <TextInput
        variant="contained"
        w="100%"
        readOnly={readonly}
        ta={type === 'number' ? 'center' : undefined}
        size="sm"
        label={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === 'number') {
                onChange?.(Number(onlyNumbers(e.target.value)));
            } else {
                onChange?.(e.target.value);
            }
        }}
    />
);

type TalentRowProps = {
    readonly: boolean;
    talent: WarhammerFantasyTalent;
    onChange: (talent: WarhammerFantasyTalent) => void;
    onDelete: () => void;
};

const TalentRow = ({
    readonly,
    talent,
    onChange,
    onDelete
}: TalentRowProps) => {
    const { T } = useApp();
    return (
        <Group w="100%">
            <Box flex="3 0">
                <TalentRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.talent.name')}
                    value={talent.name}
                    onChange={(name: string) => {
                        onChange({ ...talent, name });
                    }}
                />
            </Box>
            <Box flex="1 0">
                <TalentRowInput
                    readonly={readonly}
                    type="number"
                    label={T('game.warhammerFantasy.talent.timesTaken')}
                    value={talent.timesTaken}
                    onChange={(timesTaken: number) => {
                        onChange({ ...talent, timesTaken });
                    }}
                />
            </Box>
            <Box flex="4 0">
                <TalentRowInput
                    readonly={readonly}
                    type="string"
                    label={T('game.warhammerFantasy.talent.description')}
                    value={talent.description}
                    onChange={(description: string) => {
                        onChange({ ...talent, description });
                    }}
                />
            </Box>
            {!readonly && !!onDelete && (
                <ActionIcon size="medium" onClick={onDelete}>
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            )}
        </Group>
    );
};

export default TalentRow;
