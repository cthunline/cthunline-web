import type {
    ApocalypseWorldCharacter,
    ApocalypseWorldPlaybook,
    ApocalypseWorldStats
} from '@cthunline/games';
import { Box, Group, Stack } from '@mantine/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    GiAutoRepair,
    GiCeremonialMask,
    GiCharacter,
    GiFullMotorcycleHelmet,
    GiHandBag,
    GiLips,
    GiMachineGunMagazine,
    GiMove,
    GiNotebook,
    GiOneEyed,
    GiSteeringWheel,
    GiStoneTablet,
    GiTrade,
    GiWarBonnet
} from 'react-icons/gi';

import { useApp } from '../../../../contexts/App.js';
import type {
    CharacterData,
    CharacterSheetStatus
} from '../../../../types/index.js';
import ApocalypseWorldLogo from '../../../svg/games/apocalypseWorld/ApocalypseWorldLogo.js';
import Portrait from '../generic/portrait/Portrait.js';
import SheetTabs, { type SheetTab } from '../generic/sheetTabs/SheetTabs.js';
import Bio from './bio/Bio.js';
import Experience from './experience/Experience.js';
import GearBarter from './gearBarter/GearBarter.js';
import Harm from './harm/Harm.js';
import Hx from './hx/Hx.js';
import Moves from './moves/Moves.js';
import Notes from './notes/Notes.js';
import BattleBabe from './playbooks/BattleBabe.js';
import Brainer from './playbooks/Brainer.js';
import Chopper from './playbooks/Chopper.js';
import Driver from './playbooks/Driver.js';
import GunLugger from './playbooks/GunLugger.js';
import HardHolder from './playbooks/HardHolder.js';
import Hocus from './playbooks/Hocus.js';
import Operator from './playbooks/Operator.js';
import SavvyHead from './playbooks/SavvyHead.js';
import Skinner from './playbooks/Skinner.js';
import Special from './special/Special.js';
import Stats from './stats/Stats.js';

export interface ApocalypseWorldSheetProps {
    status: CharacterSheetStatus;
    readonly: boolean;
    data: ApocalypseWorldCharacter;
    listening?: boolean;
    onChange: (
        name: string,
        data: CharacterData,
        instantRefresh?: boolean
    ) => void;
    portrait: string | null;
    onPortraitChange?: (file: File | null) => void;
}

const playbooksTabsData: Partial<
    Record<
        ApocalypseWorldPlaybook,
        {
            icon: React.ReactElement;
        }
    >
> = {
    battleBabe: {
        icon: <GiLips />
    },
    brainer: {
        icon: <GiCeremonialMask />
    },
    chopper: {
        icon: <GiFullMotorcycleHelmet />
    },
    driver: {
        icon: <GiSteeringWheel />
    },
    gunLugger: {
        icon: <GiMachineGunMagazine />
    },
    hardHolder: {
        icon: <GiWarBonnet />
    },
    hocus: {
        icon: <GiStoneTablet />
    },
    operator: {
        icon: <GiTrade />
    },
    savvyHead: {
        icon: <GiAutoRepair />
    },
    skinner: {
        icon: <GiOneEyed />
    }
};

const ApocalypseWorldSheet = ({
    status,
    readonly,
    data,
    listening,
    onChange,
    portrait,
    onPortraitChange
}: ApocalypseWorldSheetProps) => {
    const { T } = useApp();

    const [characterData, setCharacterData] =
        useState<ApocalypseWorldCharacter>(data);
    const [tabValue, setTabValue] = useState<string>('bioStats');

    useEffect(() => {
        if (listening) {
            setCharacterData(data);
        }
    }, [listening, data]);

    const initialRender = useRef(true);
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else if (!readonly) {
            const {
                playbook,
                bio: { name }
            } = characterData;
            const properName = name || '[No Name]';
            const characterName = `${properName} (${T(`game.apocalypseWorld.playbooks.${playbook}.short`)})`;
            onChange(characterName, characterData);
        }
    }, [readonly, onChange, characterData, T]);

    const onPartialCharacterChange = useCallback(
        (partialChar: Partial<ApocalypseWorldCharacter>) => {
            setCharacterData((previous) => ({
                ...previous,
                ...partialChar
            }));
        },
        []
    );

    const sheetTabs: Record<string, SheetTab> = useMemo(() => {
        const playbookTab = playbooksTabsData[characterData.playbook];
        return {
            bioStats: {
                key: 'bioStats',
                icon: <GiCharacter size={20} />,
                label: T('game.apocalypseWorld.bioStats')
            },
            moves: {
                key: 'moves',
                icon: <GiMove size={20} />,
                label: T('game.apocalypseWorld.moves')
            },
            ...(playbookTab
                ? {
                      [characterData.playbook]: {
                          key: characterData.playbook,
                          icon: playbookTab.icon,
                          label: T(
                              `game.apocalypseWorld.playbooks.${characterData.playbook}.short`
                          )
                      }
                  }
                : {}),
            gear: {
                key: 'gear',
                icon: <GiHandBag size={20} />,
                label: T('game.apocalypseWorld.gear')
            },
            notes: {
                key: 'notes',
                icon: <GiNotebook size={20} />,
                label: T('game.apocalypseWorld.notes')
            }
        };
    }, [characterData.playbook, T]);

    return (
        <SheetTabs
            readonly={readonly}
            status={status}
            logoSvgComponent={ApocalypseWorldLogo}
            contentScroll={sheetTabs[tabValue]?.key !== 'notes'}
            tabs={Object.values(sheetTabs)}
            selectedValue={tabValue}
            onChange={(val) => setTabValue(val)}
        >
            {/* bio & stats */}
            {sheetTabs[tabValue]?.key === 'bioStats' && (
                <Stack w="100%">
                    <Group w="100%" align="start">
                        {/* biography */}
                        <Stack flex="4 0">
                            <Bio
                                readonly={readonly}
                                character={characterData}
                                onChange={onPartialCharacterChange}
                            />
                        </Stack>
                        {/* portrait */}
                        <Box flex="1 0">
                            <Portrait
                                value={portrait}
                                readonly={readonly}
                                onChange={onPortraitChange}
                            />
                        </Box>
                    </Group>
                    <Stack w="100%" gap="2rem">
                        <Stats
                            readonly={readonly}
                            character={characterData}
                            onChange={(stats: ApocalypseWorldStats) => {
                                onPartialCharacterChange({ stats });
                            }}
                        />
                        <Group w="100%" gap="4rem" align="start">
                            <Stack flex="5 0" gap="2rem">
                                <Harm
                                    readonly={readonly}
                                    character={characterData}
                                    onChange={onPartialCharacterChange}
                                />
                                <Special character={characterData} />
                                <Hx
                                    readonly={readonly}
                                    character={characterData}
                                    onChange={onPartialCharacterChange}
                                />
                            </Stack>
                            <Stack flex="4 0" gap="2rem">
                                <Experience
                                    readonly={readonly}
                                    character={characterData}
                                    onChange={onPartialCharacterChange}
                                />
                            </Stack>
                        </Group>
                    </Stack>
                </Stack>
            )}
            {/* moves */}
            {sheetTabs[tabValue]?.key === 'moves' && (
                <Stack w="100%">
                    <Moves
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {/* gear */}
            {sheetTabs[tabValue]?.key === 'gear' && (
                <Stack w="100%" h="100%">
                    <GearBarter
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {/* notes */}
            {sheetTabs[tabValue]?.key === 'notes' && (
                <Stack w="100%" h="100%">
                    <Notes
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {/* playbooks */}
            {sheetTabs[tabValue]?.key === 'battleBabe' && (
                <Stack w="100%" h="100%">
                    <BattleBabe
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'brainer' && (
                <Stack w="100%">
                    <Brainer
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'chopper' && (
                <Stack w="100%">
                    <Chopper
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'driver' && (
                <Stack w="100%">
                    <Driver
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'gunLugger' && (
                <Stack w="100%">
                    <GunLugger
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'hardHolder' && (
                <Stack w="100%">
                    <HardHolder
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'hocus' && (
                <Stack w="100%">
                    <Hocus
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'operator' && (
                <Stack w="100%">
                    <Operator
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'savvyHead' && (
                <Stack w="100%">
                    <SavvyHead
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
            {sheetTabs[tabValue]?.key === 'skinner' && (
                <Stack w="100%">
                    <Skinner
                        readonly={readonly}
                        character={characterData}
                        onChange={onPartialCharacterChange}
                    />
                </Stack>
            )}
        </SheetTabs>
    );
};

export default ApocalypseWorldSheet;
