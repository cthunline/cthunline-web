import {
    type ApocalypseWorldCharacter,
    type ApocalypseWorldImprovement,
    type ApocalypseWorldPlaybook,
    apocalypseWorld
} from '@cthunline/games';
import {
    ActionIcon,
    Checkbox,
    Divider,
    Group,
    Radio,
    Stack,
    Text
} from '@mantine/core';
import { useMemo } from 'react';
import { GiUpgrade } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

import { useApp } from '../../../../../contexts/App.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

interface ImprovementListProps {
    readonly: boolean;
    playbook?: ApocalypseWorldPlaybook;
    improvementNames: string[];
    improvementValues: Map<string, boolean>;
    onChange: (improvements: ApocalypseWorldImprovement[]) => void;
}

type ImprovementNameWithCountData = {
    name: string;
    nameWithCount: string;
};

const ImprovementList = ({
    readonly,
    playbook,
    improvementNames,
    improvementValues,
    onChange
}: ImprovementListProps) => {
    const { T, t } = useApp();

    const improvementNamesWithCounts: ImprovementNameWithCountData[] =
        useMemo(() => {
            const namesWithCount: ImprovementNameWithCountData[] = [];
            const nameMap = new Map<string, number>();
            for (const name of improvementNames) {
                const count = nameMap.get(name);
                if (count) {
                    const newCount = count + 1;
                    namesWithCount.push({
                        name,
                        nameWithCount: `${name}-${newCount}`
                    });
                    nameMap.set(name, newCount);
                } else {
                    namesWithCount.push({
                        name,
                        nameWithCount: name
                    });
                    nameMap.set(name, 1);
                }
            }
            return namesWithCount;
        }, [improvementNames]);

    return (
        <Stack gap="0.5rem" w="100%">
            {improvementNamesWithCounts.map(
                ({ name, nameWithCount }, index) => (
                    <Group gap="0.5rem" key={`improvement-${nameWithCount}}`}>
                        <Checkbox
                            size="xs"
                            checked={!!improvementValues.get(nameWithCount)}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                if (!readonly) {
                                    onChange(
                                        improvementNamesWithCounts.map(
                                            (
                                                {
                                                    name: improvementName,
                                                    nameWithCount:
                                                        improvementNameWithCount
                                                },
                                                idx
                                            ) => ({
                                                name: improvementName,
                                                enabled:
                                                    index === idx
                                                        ? e.target.checked
                                                        : !!improvementValues.get(
                                                              improvementNameWithCount
                                                          )
                                            })
                                        )
                                    );
                                }
                            }}
                        />
                        <Text fz="0.875rem">
                            {T(
                                `game.apocalypseWorld.experience.improvements.${name}`,
                                playbook && name === 'newPlaybookMove'
                                    ? {
                                          playbook: t(
                                              `game.apocalypseWorld.playbooks.${playbook}.long`
                                          )
                                      }
                                    : undefined
                            )}
                        </Text>
                    </Group>
                )
            )}
        </Stack>
    );
};

interface ExperienceProps {
    readonly: boolean;
    character: ApocalypseWorldCharacter;
    onChange: (data: Partial<ApocalypseWorldCharacter>) => void;
}

const Experience = ({ readonly, character, onChange }: ExperienceProps) => {
    const { T } = useApp();

    const improvementValues: Map<string, boolean> = useMemo(() => {
        const nameMap = new Map<string, number>();
        return new Map(
            [
                ...character.experience.commonImprovements,
                ...character[character.playbook].improvements
            ].map(({ name, enabled }) => {
                const count = nameMap.get(name);
                if (count) {
                    const newCount = count + 1;
                    nameMap.set(name, newCount);
                    return [`${name}-${newCount}`, enabled];
                }
                nameMap.set(name, 1);
                return [name, enabled];
            })
        );
    }, [character]);

    const onExperienceValueChange = (value: number) => {
        onChange({
            experience: {
                ...character.experience,
                value
            }
        });
    };

    const onCommonImprovementChange = (
        improvements: ApocalypseWorldImprovement[]
    ) => {
        onChange({
            experience: {
                ...character.experience,
                commonImprovements: improvements
            }
        });
    };

    const onPlaybookImprovementChange = (
        improvements: ApocalypseWorldImprovement[]
    ) => {
        onChange({
            [character.playbook]: {
                ...character[character.playbook],
                improvements
            }
        });
    };

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiUpgrade size={20} />}
                text={T('game.apocalypseWorld.experience.title')}
            />
            <Group justify="start" gap="1rem" w="100%">
                <Group gap="0.5rem">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <Radio
                            key={`experience-radio-${value.toString()}`}
                            variant="outline"
                            size="sm"
                            checked={character.experience.value >= value}
                            onClick={() => {
                                if (!readonly) {
                                    onExperienceValueChange(value);
                                }
                            }}
                        />
                    ))}
                </Group>
                {!readonly && (
                    <ActionIcon
                        size="xs"
                        color="red"
                        onClick={() => {
                            onExperienceValueChange(0);
                        }}
                    >
                        <MdClose />
                    </ActionIcon>
                )}
            </Group>
            <ImprovementList
                readonly={readonly}
                playbook={character.playbook}
                improvementNames={
                    apocalypseWorld.data.playbooks[character.playbook]
                        .improvements
                }
                improvementValues={improvementValues}
                onChange={onPlaybookImprovementChange}
            />
            <Divider />
            <ImprovementList
                readonly={readonly}
                improvementNames={apocalypseWorld.data.commonImprovements}
                improvementValues={improvementValues}
                onChange={onCommonImprovementChange}
            />
        </Stack>
    );
};

export default Experience;
