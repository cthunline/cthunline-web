import { Group, Stack, type StackProps } from '@mantine/core';
import { GiDarkSquad } from 'react-icons/gi';
import {
    type ApocalypseWorldCharacter,
    type ApocalypseWorldCharacterHardHolderHolding
} from '@cthunline/games';

import SectionTitle from '../../../generic/sectionTitle/SectionTitle.js';
import { useApp } from '../../../../../../contexts/App.js';
import TextInput from '../../../../../common/TextInput.js';
import Textarea from '../../../../../common/Textarea.js';

interface HoldingProps extends Omit<StackProps, 'onChange'> {
    readonly?: boolean;
    character: ApocalypseWorldCharacter;
    onChange?: (data: Pick<ApocalypseWorldCharacter, 'hardHolder'>) => void;
}

const Holding = ({ readonly, character, onChange, ...props }: HoldingProps) => {
    const { T } = useApp();

    const onHoldingValueChange = (
        data: Partial<ApocalypseWorldCharacterHardHolderHolding['holdingStats']>
    ) => {
        onChange?.({
            hardHolder: {
                ...character.hardHolder,
                holding: {
                    ...character.hardHolder.holding,
                    holdingStats: {
                        ...character.hardHolder.holding.holdingStats,
                        ...data
                    }
                }
            }
        });
    };

    return (
        <Stack gap="1rem" {...props}>
            <SectionTitle
                iconBefore={<GiDarkSquad size={20} />}
                text={T(
                    'game.apocalypseWorld.playbooks.hardHolder.holding.title'
                )}
            />
            <Stack gap="1rem" w="100%">
                <Group gap="1rem" w="100%">
                    <TextInput
                        variant="contained"
                        flex="2 0"
                        readOnly={readonly}
                        size="sm"
                        label={T(
                            'game.apocalypseWorld.playbooks.hardHolder.holding.size'
                        )}
                        value={character.hardHolder.holding.holdingStats.size}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onHoldingValueChange({
                                size: e.target.value
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
                                'game.apocalypseWorld.playbooks.hardHolder.holding.surplus'
                            )}
                            value={
                                character.hardHolder.holding.holdingStats
                                    .surplus
                            }
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onHoldingValueChange({
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
                                'game.apocalypseWorld.playbooks.hardHolder.holding.barter'
                            )}
                            value={
                                character.hardHolder.holding.holdingStats.barter
                            }
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onHoldingValueChange({
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
                            'game.apocalypseWorld.playbooks.hardHolder.holding.gigs'
                        )}
                        value={character.hardHolder.holding.holdingStats.gigs}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onHoldingValueChange({
                                gigs: e.target.value
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
                            'game.apocalypseWorld.playbooks.hardHolder.holding.want'
                        )}
                        value={character.hardHolder.holding.holdingStats.want}
                        onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                            onHoldingValueChange({
                                want: e.target.value
                            });
                        }}
                    />
                </Group>
            </Stack>
        </Stack>
    );
};

export default Holding;
