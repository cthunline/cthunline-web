import type {
    WarhammerFantasyAmbitions,
    WarhammerFantasyCharacter,
    WarhammerFantasyExperience,
    WarhammerFantasyFate,
    WarhammerFantasyMovement,
    WarhammerFantasyParty,
    WarhammerFantasyResilience,
    WarhammerFantasyWounds
} from '@cthunline/games';
import { Group, Stack } from '@mantine/core';
import {
    GiBookAura,
    GiBrain,
    GiBrainTentacle,
    GiCartwheel,
    GiHeartPlus,
    GiOvermind,
    GiRun,
    GiThreeFriends,
    GiUpgrade
} from 'react-icons/gi';

import { useApp } from '../../../../../contexts/App.js';
import { GameId } from '../../../../../types/index.js';
import TextInput from '../../../../common/TextInput.js';
import Textarea from '../../../../common/Textarea.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';
import {
    ambitionsFields,
    experienceFields,
    fateFields,
    movementFields,
    partyFields,
    resilienceFields,
    woundsFields
} from '../fields.js';
import {
    controlStatus,
    controlWounds
} from '../warhammerFantasySheet.helper.js';
import Advantage from './Advantage.js';

export interface StatusProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (partialChar: Partial<WarhammerFantasyCharacter>) => void;
}

const Status = ({ readonly, character, onChange }: StatusProps) => {
    const { T } = useApp();
    return (
        <Stack w="100%">
            <Group w="100%">
                <Stack gap="1rem" flex="2 0">
                    <Group gap="2rem">
                        {/* fate */}
                        <Stack gap="0.5rem" flex="1 0">
                            <SectionTitle
                                iconBefore={<GiCartwheel size={20} />}
                                text={T('game.warhammerFantasy.fate.fate')}
                            />
                            <FieldLayout<WarhammerFantasyFate>
                                gameId={GameId.warhammerFantasy}
                                fields={fateFields}
                                textSectionKey="fate"
                                data={character.fate}
                                readonly={readonly}
                                onChange={(fate: WarhammerFantasyFate) =>
                                    onChange(controlStatus({ fate }))
                                }
                            />
                        </Stack>
                        {/* resilience */}
                        <Stack gap="0.5rem" flex="1 0">
                            <SectionTitle
                                iconBefore={<GiOvermind size={20} />}
                                text={T(
                                    'game.warhammerFantasy.resilience.resilience'
                                )}
                            />
                            <FieldLayout<WarhammerFantasyResilience>
                                gameId={GameId.warhammerFantasy}
                                fields={resilienceFields}
                                textSectionKey="resilience"
                                data={character.resilience}
                                readonly={readonly}
                                onChange={(
                                    resilience: WarhammerFantasyResilience
                                ) => onChange(controlStatus({ resilience }))}
                            />
                        </Stack>
                    </Group>

                    <TextInput
                        variant="contained"
                        w="100%"
                        readOnly={readonly}
                        label={T('game.warhammerFantasy.resilience.motivation')}
                        size="sm"
                        value={character.resilience.motivation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            onChange({
                                resilience: {
                                    ...character.resilience,
                                    motivation: e.target.value
                                }
                            });
                        }}
                    />
                </Stack>
                {/* experience */}
                <Stack gap="0.5rem" flex="1 0">
                    <SectionTitle
                        iconBefore={<GiUpgrade size={20} />}
                        text={T('game.warhammerFantasy.experience.experience')}
                    />
                    <FieldLayout<WarhammerFantasyExperience>
                        gameId={GameId.warhammerFantasy}
                        fields={experienceFields}
                        textSectionKey="experience"
                        data={character.experience}
                        readonly={readonly}
                        onChange={(experience: WarhammerFantasyExperience) =>
                            onChange(controlStatus({ experience }))
                        }
                    />
                </Stack>
                {/* movement */}
                <Stack gap="0.5rem" flex="1 0">
                    <SectionTitle
                        iconBefore={<GiRun size={20} />}
                        text={T('game.warhammerFantasy.movement.movement')}
                    />
                    <FieldLayout<WarhammerFantasyMovement>
                        gameId={GameId.warhammerFantasy}
                        fields={movementFields}
                        textSectionKey="movement"
                        data={character.movement}
                        readonly={readonly}
                        onChange={(movement: WarhammerFantasyMovement) =>
                            onChange(controlStatus({ movement }))
                        }
                    />
                </Stack>
            </Group>
            <Group gap="2rem" w="100%">
                <Stack gap="0.5rem" flex="1 0">
                    {/* advantage */}
                    <Advantage
                        character={character}
                        readonly={readonly}
                        onChange={(
                            partialChar: Pick<
                                WarhammerFantasyCharacter,
                                'advantage'
                            >
                        ) => onChange(partialChar)}
                    />
                    {/* wounds */}
                    <SectionTitle
                        iconBefore={<GiHeartPlus size={20} />}
                        text={T('game.warhammerFantasy.common.wounds')}
                    />
                    <FieldLayout<WarhammerFantasyWounds>
                        gameId={GameId.warhammerFantasy}
                        fields={woundsFields}
                        textSectionKey="wounds"
                        data={character.wounds}
                        readonly={readonly}
                        onChange={(wounds: WarhammerFantasyWounds) =>
                            onChange({
                                wounds: controlWounds(
                                    character.characteristics,
                                    wounds
                                )
                            })
                        }
                    />
                </Stack>
                <Stack gap="1rem" flex="1 0">
                    {/* psychology */}
                    <Stack gap="0.5rem" w="100%">
                        <SectionTitle
                            iconBefore={<GiBrain size={20} />}
                            text={T('game.warhammerFantasy.common.psychology')}
                        />
                        <Textarea
                            w="100%"
                            rows={4}
                            readOnly={readonly}
                            label={T('game.warhammerFantasy.common.psychology')}
                            size="sm"
                            value={character.psychology}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                                onChange({ psychology: e.target.value });
                            }}
                        />
                    </Stack>
                    {/* corruption & mutation */}
                    <Stack gap="0.5rem" w="100%">
                        <SectionTitle
                            iconBefore={<GiBrainTentacle size={20} />}
                            text={T(
                                'game.warhammerFantasy.common.corruptionMutation'
                            )}
                        />
                        <Textarea
                            w="100%"
                            rows={4}
                            readOnly={readonly}
                            label={T(
                                'game.warhammerFantasy.common.corruptionMutation'
                            )}
                            size="sm"
                            value={character.corruptionMutation}
                            onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                            ) => {
                                onChange({
                                    corruptionMutation: e.target.value
                                });
                            }}
                        />
                    </Stack>
                </Stack>
            </Group>
            <Group gap="2rem" w="100%">
                {/* ambitions */}
                <Stack gap="0.5rem" flex="1 0">
                    <SectionTitle
                        iconBefore={<GiBookAura size={20} />}
                        text={T('game.warhammerFantasy.common.ambitions')}
                    />
                    <FieldLayout<WarhammerFantasyAmbitions>
                        gameId={GameId.warhammerFantasy}
                        fields={ambitionsFields}
                        textSectionKey="ambitions"
                        data={character.ambitions}
                        readonly={readonly}
                        onChange={(ambitions: WarhammerFantasyAmbitions) =>
                            onChange({ ambitions })
                        }
                    />
                </Stack>
                {/* party */}
                <Stack gap="0.5rem" flex="1 0">
                    <SectionTitle
                        iconBefore={<GiThreeFriends size={20} />}
                        text={T('game.warhammerFantasy.common.party')}
                    />
                    <FieldLayout<WarhammerFantasyParty>
                        gameId={GameId.warhammerFantasy}
                        fields={partyFields}
                        textSectionKey="party"
                        data={character.party}
                        readonly={readonly}
                        onChange={(party: WarhammerFantasyParty) =>
                            onChange({ party })
                        }
                    />
                </Stack>
            </Group>
        </Stack>
    );
};

export default Status;
