import { ActionIcon, Box, Checkbox, Group } from '@mantine/core';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { type CoCSkill } from '@cthunline/games';

import { onlyNumbers } from '../../../../../services/tools.js';
import TextInput from '../../../../common/TextInput.js';
import { useApp } from '../../../../../contexts/App.js';
import { controlSkill } from '../cocSheet.helper.js';
import { skillKeys } from './skills.data.js';

interface SkillProps {
    index: number;
    data: CoCSkill;
    readonly: boolean;
    onChange: (index: number, data: CoCSkill) => void;
    onDelete: (index: number) => void;
}

const Skill = ({ index, data, readonly, onChange, onDelete }: SkillProps) => {
    const { T } = useApp();

    return (
        <Group w="100%" gap="0.5rem">
            <Box flex="1 0">
                {data.development ? (
                    <Checkbox
                        checked={data.developed}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!readonly) {
                                onChange(
                                    index,
                                    controlSkill({
                                        ...data,
                                        developed: e.target.checked
                                    })
                                );
                            }
                        }}
                    />
                ) : null}
            </Box>
            <Box flex="6 0">{data.name}</Box>
            <Box flex="2 0">
                <TextInput
                    variant="contained"
                    w="100%"
                    readOnly
                    size="sm"
                    label={T('game.callOfCthulhu.common.base')}
                    value={data.base}
                />
            </Box>
            {skillKeys.map(({ key, textKey, editable }) => (
                <Box flex="1 0" key={key.toString()}>
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly || !editable}
                        size="sm"
                        label={T(`game.callOfCthulhu.common.${textKey}`)}
                        value={data[key].toString()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange(
                                index,
                                controlSkill({
                                    ...data,
                                    [key]: Number(onlyNumbers(e.target.value))
                                })
                            );
                        }}
                    />
                </Box>
            ))}
            {readonly ? null : (
                <Box>
                    <ActionIcon color="red" onClick={() => onDelete(index)}>
                        <MdOutlineDeleteOutline />
                    </ActionIcon>
                </Box>
            )}
        </Group>
    );
};

export default Skill;
