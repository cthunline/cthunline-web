import { Box, Stack, Tabs } from '@mantine/core';

export interface SheetTab {
    key: string;
    icon: JSX.Element;
    label: string;
}

export interface SheetTabsProps {
    children: React.ReactNode;
    tabs: SheetTab[];
    selectedValue: string;
    logoSvgComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
    onChange: (value: string) => void;
}

const SheetTabs = ({
    children,
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
                <Box w="100%" h="2rem" my="0.5rem" px="1.5rem" ta="center">
                    <SVGLogo
                        fill="var(--palette-font)"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    />
                </Box>
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
