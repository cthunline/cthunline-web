import { Box, Group, Stack, Tabs } from '@mantine/core';

import { type CharacterSheetStatus } from '../../../../../types/index.js';
import Status from '../../Status.js';

export interface SheetTab {
    key: string;
    icon: JSX.Element;
    label: string;
}

export interface SheetTabsProps {
    children: React.ReactNode;
    readonly: boolean;
    status: CharacterSheetStatus;
    tabs: SheetTab[];
    selectedValue: string;
    logoSvgComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
    onChange: (value: string) => void;
}

const SheetTabs = ({
    children,
    readonly,
    status,
    tabs,
    selectedValue,
    logoSvgComponent: SVGLogo,
    onChange
}: SheetTabsProps) => {
    const handleChange = (value: string | null) => {
        onChange(value ?? '');
    };
    return (
        <Stack mah="100%" gap="0.5rem">
            {SVGLogo ? (
                <Group
                    w="100%"
                    h="2rem"
                    my="0.5rem"
                    px="1.5rem"
                    align="start"
                    justify="start"
                >
                    <Box w="2rem" h="100%" />
                    <Box flex="1 0" h="100%">
                        <SVGLogo
                            fill="var(--palette-font)"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%'
                            }}
                        />
                    </Box>
                    <Group w="2rem" h="100%" align="center" justify="end">
                        {!readonly && <Status status={status} />}
                    </Group>
                </Group>
            ) : null}
            {/* tabs */}
            <Tabs value={selectedValue} onChange={handleChange}>
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab
                            key={`sheet-tab-${tab.key}`}
                            value={tab.key}
                            leftSection={tab.icon}
                        >
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </Tabs>
            {/* content */}
            <Stack
                flex={1}
                w="100%"
                h={0}
                p="1rem"
                style={{ overflowY: 'auto' }}
            >
                {children}
            </Stack>
        </Stack>
    );
};

export default SheetTabs;
