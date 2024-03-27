import { Stack, TextField } from '@mui/material';
import {
    GiCartwheel,
    GiOvermind,
    GiUpgrade,
    GiRun,
    GiHeartPlus,
    GiBrain,
    GiBrainTentacle,
    GiBookAura,
    GiThreeFriends
} from 'react-icons/gi';
import {
    type WarhammerFantasyCharacter,
    type WarhammerFantasyFate,
    type WarhammerFantasyMovement,
    type WarhammerFantasyExperience,
    type WarhammerFantasyResilience,
    type WarhammerFantasyWounds,
    type WarhammerFantasyAmbitions,
    type WarhammerFantasyParty
} from '@cthunline/games';

import { controlStatus, controlWounds } from '../warhammerFantasySheet.helper';
import FieldLayout, { Field } from '../../generic/fieldLayout/FieldLayout';
import SectionTitle from '../../generic/sectionTitle/SectionTitle';
import { useApp } from '../../../../contexts/App';
import { GameId } from '../../../../../types';
import Advantage from './Advantage';
import fields from '../fields.json';

const fateFields = fields.fate as Field<WarhammerFantasyFate>[];
const resilienceFields = fields.resilience as Field<
    Omit<WarhammerFantasyResilience, 'motivation'>
>[];
const motivationFields = fields.motivation as Field<
    Pick<WarhammerFantasyResilience, 'motivation'>
>[];
const experienceFields =
    fields.experience as Field<WarhammerFantasyExperience>[];
const movementFields = fields.movement as Field<WarhammerFantasyMovement>[];
const woundsFields = fields.wounds as Field<WarhammerFantasyWounds>[];
const ambitionsFields = fields.ambitions as Field<WarhammerFantasyAmbitions>[];
const partyFields = fields.party as Field<WarhammerFantasyParty>[];

export interface StatusProps {
    readonly: boolean;
    character: WarhammerFantasyCharacter;
    onChange: (partialChar: Partial<WarhammerFantasyCharacter>) => void;
}

const Status = ({ readonly, character, onChange }: StatusProps) => {
    const { T } = useApp();
    return (
        <>
            <Stack direction="row" gap="2rem" width="100%">
                <Stack direction="column" gap="1rem" flex="2 0">
                    <Stack direction="row" gap="2rem">
                        {/* fate */}
                        <Stack direction="column" gap="0.5rem" flex="1 0">
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
                                rowGap={2}
                                columnGap={0}
                            />
                        </Stack>
                        {/* resilience */}
                        <Stack direction="column" gap="0.5rem" flex="1 0">
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
                                rowGap={2}
                                columnGap={0}
                            />
                        </Stack>
                    </Stack>
                    <FieldLayout<WarhammerFantasyResilience>
                        gameId={GameId.warhammerFantasy}
                        fields={motivationFields}
                        textSectionKey="resilience"
                        data={character.resilience}
                        readonly={readonly}
                        onChange={(resilience: WarhammerFantasyResilience) =>
                            onChange({ resilience })
                        }
                    />
                </Stack>
                {/* experience */}
                <Stack direction="column" gap="0.5rem" flex="1 0">
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
                        rowGap={2}
                        columnGap={0}
                    />
                </Stack>
                {/* movement */}
                <Stack direction="column" gap="0.5rem" flex="1 0">
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
                        rowGap={2}
                        columnGap={0}
                    />
                </Stack>
            </Stack>
            <Stack direction="row" gap="2rem" width="100%">
                <Stack direction="column" gap="0.5rem" flex="1 0">
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
                        rowGap={2}
                        columnGap={0}
                    />
                </Stack>
                <Stack direction="column" gap="1rem" flex="1 0">
                    {/* psychology */}
                    <Stack direction="column" gap="0.5rem" width="100%">
                        <SectionTitle
                            iconBefore={<GiBrain size={20} />}
                            text={T('game.warhammerFantasy.common.psychology')}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            InputProps={{
                                readOnly: readonly,
                                classes: {
                                    input: 'input-smaller-text'
                                }
                            }}
                            label={T('game.warhammerFantasy.common.psychology')}
                            type="text"
                            size="small"
                            value={character.psychology}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange({ psychology: e.target.value });
                            }}
                        />
                    </Stack>
                    {/* corruption & mutation */}
                    <Stack direction="column" gap="0.5rem" width="100%">
                        <SectionTitle
                            iconBefore={<GiBrainTentacle size={20} />}
                            text={T(
                                'game.warhammerFantasy.common.corruptionMutation'
                            )}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            InputProps={{
                                readOnly: readonly,
                                classes: {
                                    input: 'input-smaller-text'
                                }
                            }}
                            label={T(
                                'game.warhammerFantasy.common.corruptionMutation'
                            )}
                            type="text"
                            size="small"
                            value={character.corruptionMutation}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                onChange({
                                    corruptionMutation: e.target.value
                                });
                            }}
                        />
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction="row" gap="2rem" width="100%">
                {/* ambitions */}
                <Stack direction="column" gap="0.5rem" flex="1 0">
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
                        rowGap={2}
                        columnGap={0}
                    />
                </Stack>
                {/* party */}
                <Stack direction="column" gap="0.5rem" flex="1 0">
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
                        rowGap={2}
                        columnGap={0}
                    />
                </Stack>
            </Stack>
        </>
    );
};

export default Status;
