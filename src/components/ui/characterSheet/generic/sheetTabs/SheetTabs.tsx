import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

import './SheetTabs.css';

export interface SheetTab {
    key: string;
    icon: JSX.Element;
    label: string;
}

export interface SheetTabsProps {
    children: React.ReactNode;
    tabs: SheetTab[];
    selectedIndex: number;
    logoSvgComponent?: React.FC<React.SVGProps<SVGSVGElement>>;
    onChange: (index: number) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({
    children,
    tabs,
    selectedIndex,
    logoSvgComponent: SVGLogo,
    onChange
}) => {
    const handleChange = (_e: React.SyntheticEvent, value: number) => {
        onChange(value);
    };

    return (
        <Box className="flex column max-full-height">
            {SVGLogo ? (
                <Box className="sheet-logo">
                    <SVGLogo className="sheet-logo-svg" />
                </Box>
            ) : null}
            {/* tabs */}
            <Tabs
                value={selectedIndex}
                onChange={handleChange}
                centered
            >
                {tabs.map((tab) => (
                    <Tab
                        key={`sheet-tab-${tab.key}`}
                        icon={tab.icon}
                        label={tab.label}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
            {/* content */}
            <Box
                className="grow full-width scroll p-25 pt-15"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                columnGap={2}
                rowGap={4}
            >
                {children}
            </Box>
        </Box>
    );
};

export default SheetTabs;
