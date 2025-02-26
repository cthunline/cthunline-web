import { type GameId, getGame } from '@cthunline/games';
import { Stack, Tabs } from '@mantine/core';

import { useState } from 'react';
import { usePlay } from '../../../../../contexts/Play.js';
import { useLocaleStore } from '../../../../../stores/locale.js';
import type {
    DiceAlienRequestBody,
    DiceRequestBody,
    WidgetType
} from '../../../../../types/index.js';
import Widget from '../../Widget.js';
import DicesAlien from './DicesAlien.js';
import DicesStandard from './DicesStandard.js';

interface DicesWidgetProps {
    isMaster?: boolean;
    onClose: (widget: WidgetType) => void;
    onRoll: (request: DiceRequestBody, isPrivate: boolean) => void;
    onRollAlien: (request: DiceAlienRequestBody, isPrivate: boolean) => void;
}

type DiceTab = 'standard' | GameId;

const DicesWidget = ({ onClose, ...restProps }: DicesWidgetProps) => {
    const T = useLocaleStore(({ T }) => T);

    const { session } = usePlay();

    if (!session) {
        throw new Error('Missing session data');
    }

    const { gameId } = session;

    const diceTabs: DiceTab[] = [
        ...(gameId === 'alien' ? (['alien'] as const) : []),
        'standard'
    ];

    const [tab, setTab] = useState<DiceTab>(diceTabs[0]);

    const onTabChange = (t: string | null) => {
        if (t) {
            setTab(t as DiceTab);
        }
    };

    return (
        <Widget
            id="widget-dices"
            title={T('entity.dices')}
            onClose={() => onClose('dices')}
        >
            <Stack w="400px">
                {diceTabs.length > 1 ? (
                    <>
                        <Tabs value={tab} onChange={onTabChange}>
                            <Tabs.List>
                                {diceTabs.map((t) => (
                                    <Tabs.Tab key={`dice-tab-${t}`} value={t}>
                                        {t === 'standard'
                                            ? T('widget.dice.standard')
                                            : getGame(t).name}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs>
                        {tab === 'standard' && <DicesStandard {...restProps} />}
                        {tab === 'alien' && (
                            <DicesAlien
                                {...restProps}
                                onRoll={restProps.onRollAlien}
                            />
                        )}
                    </>
                ) : (
                    <DicesStandard {...restProps} />
                )}
            </Stack>
        </Widget>
    );
};

export default DicesWidget;
