import React from 'react';
import { Tabs, Tab } from '@mui/material';

export interface SheetTab {
    key: string;
    icon: JSX.Element;
    label: string;
}

export interface SheetTabsProps {
    tabs: SheetTab[];
    selectedIndex: number;
    onChange: (index: number) => void;

}

const SheetTabs: React.FC<SheetTabsProps> = ({
    tabs,
    selectedIndex,
    onChange
}) => {
    const handleChange = (e: React.SyntheticEvent, value: number) => {
        onChange(value);
    };

    return (
        <Tabs
            value={selectedIndex}
            onChange={handleChange}
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
    );
};

export default SheetTabs;
