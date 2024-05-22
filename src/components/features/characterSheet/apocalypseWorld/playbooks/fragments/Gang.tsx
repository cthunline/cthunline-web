import { type ApocalypseWorldCharacterHardHolderGang } from '@cthunline/games';
import { Group, Stack, type StackProps } from '@mantine/core';
import { GiDarkSquad } from 'react-icons/gi';

import SectionTitle from '../../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../../contexts/App.js';
import TextInput from '../../../../../common/TextInput.js';
import Textarea from '../../../../../common/Textarea.js';

type GenericGang = ApocalypseWorldCharacterHardHolderGang;

interface GangProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    translation: string;
    gang: GenericGang;
    onChange: (gang: GenericGang) => void;
}

const Gang = ({
    readonly,
    translation,
    gang,
    onChange,
    ...props
}: GangProps) => {
    const { T } = useApp();

    const onGangChange = (data: Partial<GenericGang>) => {
        onChange?.({
            ...gang,
            ...data
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <SectionTitle
                iconBefore={<GiDarkSquad size={20} />}
                text={T(`${translation}.title`)}
            />
            <Group gap="1rem" w="100%" align="start">
                <Stack gap="1.75rem" w="10rem">
                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly}
                        size="sm"
                        label={T(`${translation}.size`)}
                        value={gang.size}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onGangChange({
                                size: e.target.value
                            });
                        }}
                    />
                    <Group gap="1rem" w="100%">
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(`${translation}.harm`)}
                            value={gang.harm}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onGangChange({
                                    harm: e.target.value
                                });
                            }}
                        />
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(`${translation}.armor`)}
                            value={gang.armor}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onGangChange({
                                    armor: e.target.value
                                });
                            }}
                        />
                    </Group>
                </Stack>
                <Textarea
                    variant="contained"
                    flex="1 0"
                    rows={4}
                    readOnly={readonly}
                    size="sm"
                    label={T(`${translation}.tags`)}
                    value={gang.tags}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        onGangChange({
                            tags: e.target.value
                        });
                    }}
                />
            </Group>
        </Stack>
    );
};

export default Gang;
