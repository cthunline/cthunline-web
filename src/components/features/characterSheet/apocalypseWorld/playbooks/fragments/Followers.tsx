import { Group, Stack, type StackProps } from '@mantine/core';
import { GiCultist } from 'react-icons/gi';
import {
    type ApocalypseWorldCharacter,
    type ApocalypseWorldCharacterHocusFollowers
} from '@cthunline/games';

import SectionTitle from '../../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../../contexts/App.js';
import TextInput from '../../../../../common/TextInput.js';
import Textarea from '../../../../../common/Textarea.js';

interface FollowersProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'hocus'>) => void;
}

const Followers = ({
    readonly,
    character,
    onChange,
    ...props
}: FollowersProps) => {
    const { T } = useApp();

    const onFollowersChange = (
        data: Partial<ApocalypseWorldCharacterHocusFollowers>
    ) => {
        onChange?.({
            hocus: {
                ...character.hocus,
                followers: {
                    ...character.hocus.followers,
                    ...data
                }
            }
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <SectionTitle
                iconBefore={<GiCultist size={20} />}
                text={T('game.apocalypseWorld.playbooks.hocus.followers.title')}
            />
            <Stack gap="1rem" w="100%">
                <Group gap="1rem" w="100%">
                    <TextInput
                        variant="contained"
                        flex="2 0"
                        readOnly={readonly}
                        size="sm"
                        label={T(
                            'game.apocalypseWorld.playbooks.hocus.followers.description'
                        )}
                        value={character.hocus.followers.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onFollowersChange({
                                description: e.target.value
                            });
                        }}
                    />
                    <Group gap="1rem" flex="4 0">
                        <TextInput
                            variant="contained"
                            flex="3 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.hocus.followers.surplus'
                            )}
                            value={character.hocus.followers.surplus}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onFollowersChange({
                                    surplus: e.target.value
                                });
                            }}
                        />
                        <TextInput
                            variant="contained"
                            flex="1 0"
                            readOnly={readonly}
                            size="sm"
                            label={T(
                                'game.apocalypseWorld.playbooks.hocus.followers.barter'
                            )}
                            value={character.hocus.followers.barter}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onFollowersChange({
                                    barter: e.target.value
                                });
                            }}
                        />
                    </Group>
                </Group>
                <Group gap="1rem" w="100%">
                    <Textarea
                        variant="contained"
                        flex="2 0"
                        rows={3}
                        readOnly={readonly}
                        size="sm"
                        label={T(
                            'game.apocalypseWorld.playbooks.hocus.followers.fortune'
                        )}
                        value={character.hocus.followers.fortune}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onFollowersChange({
                                fortune: e.target.value
                            });
                        }}
                    />
                    <Textarea
                        variant="contained"
                        flex="4 0"
                        rows={3}
                        readOnly={readonly}
                        size="sm"
                        label={T(
                            'game.apocalypseWorld.playbooks.hocus.followers.want'
                        )}
                        value={character.hocus.followers.want}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onFollowersChange({
                                want: e.target.value
                            });
                        }}
                    />
                </Group>
            </Stack>
        </Stack>
    );
};

export default Followers;
