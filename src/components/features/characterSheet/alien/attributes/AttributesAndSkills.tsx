import type { AlienAttribute, AlienAttributes } from '@cthunline/games';
import { Group, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { GiSkills } from 'react-icons/gi';

import { onlyNumbers } from '../../../../../services/tools.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import TextInput from '../../../../common/TextInput.js';
import FieldLayout from '../../generic/fieldLayout/FieldLayout.js';
import SectionTitle from '../../generic/sectionTitle/SectionTitle.js';

type AttributeSkill<T extends AlienAttribute = AlienAttribute> =
    keyof AlienAttributes[T]['skills'];

type AttributeSkillsData<T extends AlienAttribute = AlienAttribute> = {
    attribute: T;
    skillKeys: AttributeSkill<T>[];
};

type AttributesSkillsData = [
    AttributeSkillsData<'strength'>,
    AttributeSkillsData<'agility'>,
    AttributeSkillsData<'wits'>,
    AttributeSkillsData<'empathy'>
];

const getSkillTranslationKey = (attribute: string, skill: string) =>
    `game.alien.attributes.${attribute}.skills.${skill}`;

const sortSkills = <T extends AlienAttribute>(
    getTranslation: (key: string, data?: Record<string, string>) => string,
    attribute: T,
    skillKeys: AttributeSkill<T>[]
): AttributeSkill<T>[] =>
    skillKeys.toSorted((a, b) => {
        const at = getTranslation(
            getSkillTranslationKey(attribute, a.toString())
        );
        const bt = getTranslation(
            getSkillTranslationKey(attribute, b.toString())
        );
        if (at < bt) {
            return -1;
        }
        if (at > bt) {
            return 1;
        }
        return 0;
    });

type AttributesAndSkillsProps = {
    attributes: AlienAttributes;
    readonly: boolean;
    onChange: (attributes: AlienAttributes) => void;
    flex?: string | number;
};

const AttributesAndSkills = ({
    attributes,
    flex,
    readonly,
    onChange
}: AttributesAndSkillsProps) => {
    const T = useLocaleStore(({ T }) => T);
    const TU = useLocaleStore(({ TU }) => TU);

    const attributesSkillsData: AttributesSkillsData = useMemo(
        () => [
            {
                attribute: 'strength',
                skillKeys: sortSkills(T, 'strength', [
                    'closeCombat',
                    'heavyMachinery',
                    'stamina'
                ])
            },
            {
                attribute: 'agility',
                skillKeys: sortSkills(T, 'agility', [
                    'mobility',
                    'piloting',
                    'rangedCombat'
                ])
            },
            {
                attribute: 'wits',
                skillKeys: sortSkills(T, 'wits', [
                    'comtech',
                    'observation',
                    'survival'
                ])
            },
            {
                attribute: 'empathy',
                skillKeys: sortSkills(T, 'empathy', [
                    'command',
                    'manipulation',
                    'medicalAid'
                ])
            }
        ],
        [T]
    );

    return (
        <Stack gap="1rem" w="100%">
            <SectionTitle
                iconBefore={<GiSkills size={20} />}
                text={T('game.alien.attributes.attributesAndSkills')}
            />
            <Group w="100%" align="start" gap="2rem" flex={flex}>
                {attributesSkillsData.map(({ attribute, skillKeys }) => (
                    <Stack flex="1 0" key={`attributes-${attribute}`}>
                        <TextInput
                            variant="default"
                            w="100%"
                            readOnly={readonly}
                            size="md"
                            label={
                                <Text fw="bold" fz="1rem">
                                    {TU(
                                        `game.alien.attributes.${attribute}.${attribute}`
                                    )}
                                </Text>
                            }
                            value={String(attributes[attribute].value)}
                            onChange={({
                                target: { value }
                            }: React.ChangeEvent<HTMLInputElement>) => {
                                onChange({
                                    ...attributes,
                                    [attribute]: {
                                        ...attributes[attribute],
                                        value: Number(onlyNumbers(value))
                                    }
                                });
                            }}
                        />
                        <Stack w="80%">
                            <FieldLayout<
                                AlienAttributes[typeof attribute]['skills']
                            >
                                variant="default"
                                gameId="alien"
                                fields={(
                                    skillKeys as AttributeSkill<
                                        typeof attribute
                                    >[]
                                ).map((skill) => ({
                                    key: skill,
                                    gridColumn: 12,
                                    type: 'number'
                                }))}
                                textSectionKey={`attributes.${attribute}.skills`}
                                data={attributes[attribute].skills}
                                readonly={readonly}
                                onChange={(
                                    skills: AlienAttributes[typeof attribute]['skills']
                                ) => {
                                    onChange({
                                        ...attributes,
                                        [attribute]: {
                                            ...attributes[attribute],
                                            skills
                                        }
                                    });
                                }}
                            />
                        </Stack>
                    </Stack>
                ))}
            </Group>
        </Stack>
    );
};

export default AttributesAndSkills;
