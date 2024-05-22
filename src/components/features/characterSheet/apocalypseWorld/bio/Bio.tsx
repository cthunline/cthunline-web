import { Group, Stack } from '@mantine/core';
import { GiIdCard } from 'react-icons/gi';
import { useMemo } from 'react';
import {
    type ApocalypseWorldPlaybook,
    type ApocalypseWorldCharacter,
    apocalypseWorld
} from '@cthunline/games';

import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import { sortObjectsBy } from '../../../../../services/tools.js';
import { useApp } from '../../../../../contexts/App.js';
import TextInput from '../../../../common/TextInput.js';
import Textarea from '../../../../common/Textarea.js';
import Select from '../../../../common/Select.js';

interface BioProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (data: ApocalypseWorldCharacter) => void;
}

const Bio = ({ readonly, character, onChange }: BioProps) => {
    const { T } = useApp();

    const playbookOptions = useMemo(() => {
        const options = Object.keys(apocalypseWorld.data.playbooks).map(
            (playbook) => ({
                value: playbook,
                label: T(`game.apocalypseWorld.playbooks.${playbook}.short`)
            })
        );
        sortObjectsBy(options, 'label');
        return options;
    }, [T]);

    const onPartialChange = (data: Partial<ApocalypseWorldCharacter>) => {
        onChange({
            ...character,
            ...data
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiIdCard size={20} />}
                text={T('game.apocalypseWorld.bio.title')}
            />
            <Stack gap="1rem" w="100%">
                <Group gap="1rem" w="100%">
                    <TextInput
                        variant="contained"
                        flex="1 0"
                        readOnly={readonly}
                        label={T('game.apocalypseWorld.bio.name')}
                        size="sm"
                        value={character.bio.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onPartialChange({
                                bio: {
                                    ...character.bio,
                                    name: e.target.value
                                }
                            });
                        }}
                    />
                    <Select
                        variant="contained"
                        valueType="string"
                        label={T('game.apocalypseWorld.playbook')}
                        options={playbookOptions}
                        value={character.playbook}
                        onChange={(val: string | null) => {
                            if (val) {
                                onPartialChange({
                                    playbook: val as ApocalypseWorldPlaybook
                                });
                            }
                        }}
                    />
                </Group>
                <Textarea
                    variant="contained"
                    w="100%"
                    rows={3}
                    readOnly={readonly}
                    label={T('game.apocalypseWorld.bio.look')}
                    size="sm"
                    value={character.bio.look}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onPartialChange({
                            bio: {
                                ...character.bio,
                                look: e.target.value
                            }
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

export default Bio;
