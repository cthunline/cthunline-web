import { useEffect, useMemo } from 'react';
import type { WidgetType, WidgetVisibility } from '../../types/index.js';

export type ShortcutsHookOptions = {
    isMaster: boolean;
    openWidget: (widget: WidgetType) => void;
    changeWidgetVisibility: (visibility: WidgetVisibility) => void;
};

type ShortcutHandlers = Map<
    string,
    {
        down: () => void;
        up?: () => void;
    }
>;

type EvenListeners = {
    keydown: (event: KeyboardEvent) => void;
    keyup: (event: KeyboardEvent) => void;
};

const useShortcuts = ({
    // isMaster,
    // openWidget,
    changeWidgetVisibility
}: ShortcutsHookOptions) => {
    const shortcutHandlers: ShortcutHandlers = useMemo(
        () =>
            new Map([
                [
                    'F2',
                    {
                        down: () => {
                            changeWidgetVisibility('hidden');
                        },
                        up: () => {
                            changeWidgetVisibility('visible');
                        }
                    }
                ]
            ]),
        [changeWidgetVisibility]
    );

    const listeners: EvenListeners = useMemo(() => {
        const getListener =
            (eventType: 'down' | 'up') => (e: KeyboardEvent) => {
                if (!e.repeat) {
                    const handler = shortcutHandlers.get(e.key);
                    if (handler?.[eventType]) {
                        e.preventDefault?.();
                        handler[eventType]();
                    }
                }
            };
        return {
            keydown: getListener('down'),
            keyup: getListener('up')
        };
    }, [shortcutHandlers]);

    useEffect(() => {
        const root = document.documentElement;
        root.removeEventListener('keydown', listeners.keydown);
        root.addEventListener('keydown', listeners.keydown);
        root.removeEventListener('keyup', listeners.keyup);
        root.addEventListener('keyup', listeners.keyup);
        return () => {
            root.removeEventListener('keydown', listeners.keydown);
            root.removeEventListener('keyup', listeners.keyup);
        };
    }, [listeners]);
};

export default useShortcuts;
