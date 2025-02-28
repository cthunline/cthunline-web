import type { ApocalypseWorldBasicListItem } from '@cthunline/games';
import { Box, Checkbox, Group, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useLocaleStore } from '../../../../../stores/locale.js';

type BasicListRowProps = {
    readonly?: boolean;
    translation: string;
    titleDescription: boolean;
    item: ApocalypseWorldBasicListItem;
    onChange: (item: ApocalypseWorldBasicListItem) => void;
};

const BasicListRow = ({
    readonly,
    translation,
    titleDescription,
    item,
    onChange
}: BasicListRowProps) => {
    const { t, T } = useLocaleStore(useShallow(({ t, T }) => ({ t, T })));
    return (
        <Group w="100%" gap="1rem" align="start">
            <Checkbox
                checked={item.enabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!readonly) {
                        onChange({
                            ...item,
                            enabled: e.target.checked
                        });
                    }
                }}
            />
            <Box flex="1 0">
                {titleDescription ? (
                    <>
                        <Text fw="bold" display="inline">
                            {`${T(`${translation}.${item.name}.title`)} : `}
                        </Text>
                        <Text
                            display="inline"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {t(`${translation}.${item.name}.description`)}
                        </Text>
                    </>
                ) : (
                    <Text>{T(`${translation}.${item.name}`)}</Text>
                )}
            </Box>
        </Group>
    );
};

type BasicListProps = {
    readonly?: boolean;
    names: string[];
    items: ApocalypseWorldBasicListItem[];
    translation: string;
    titleDescription?: boolean;
    onChange: (items: ApocalypseWorldBasicListItem[]) => void;
};

const BasicList = ({
    readonly,
    names,
    items,
    translation,
    titleDescription = true,
    onChange
}: BasicListProps) => {
    const enabledByName: Map<string, boolean> = useMemo(
        () => new Map(items.map(({ name, enabled }) => [name, enabled])),
        [items]
    );
    return (
        <Stack gap="1rem" w="100%">
            {names.map((name, index) => (
                <BasicListRow
                    key={`list-row-${translation}.${name}`}
                    readonly={readonly}
                    translation={translation}
                    titleDescription={titleDescription}
                    item={{
                        name,
                        enabled: !!enabledByName.get(name)
                    }}
                    onChange={(itm) => {
                        if (!readonly && onChange) {
                            const updatedList = [...items];
                            updatedList[index] = itm;
                            onChange(updatedList);
                        }
                    }}
                />
            ))}
        </Stack>
    );
};

export default BasicList;
