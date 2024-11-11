import type { WidgetType } from '../../../types/index.js';

export type PlayMenuEntry = WidgetType | 'see' | 'exit';

export const playMenuEntries: {
    master: PlayMenuEntry[];
    player: PlayMenuEntry[];
} = {
    master: [
        'characters',
        'dices',
        'sketch',
        'jukebox',
        'notes',
        'see',
        'exit'
    ],
    player: ['character', 'dices', 'notes', 'see', 'exit']
} as const;
