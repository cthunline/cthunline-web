import { Howl } from 'howler';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

import {
    type UseAudioVolumeExport,
    defaultUseAudioVolumeExport,
    useAudioVolume
} from '../hooks/useAudioVolume.js';
import { getAssetUrl } from '../services/api.js';
import type { Asset } from '../types/index.js';
import type { SocketClient } from '../types/socket.js';

interface AudioClientProviderProps {
    children: React.ReactElement | React.ReactElement[];
    socket: SocketClient;
}

interface AudioClientContextData
    extends Omit<UseAudioVolumeExport, 'howlVolume'> {
    initialized: boolean;
    playing: boolean;
    playAudio: (track: Asset, time: number) => void;
    stopAudio: () => void;
}

const defaultContextData: AudioClientContextData = {
    initialized: false,
    playing: false,
    playAudio: () => {
        /* default */
    },
    stopAudio: () => {
        /* default */
    },
    ...defaultUseAudioVolumeExport
};

const AudioClientContext =
    createContext<AudioClientContextData>(defaultContextData);

export const AudioClientProvider = ({
    children,
    socket
}: AudioClientProviderProps) => {
    const howlRef = useRef<Howl | null>(null);
    const trackRef = useRef<Asset | null>(null);
    const [playing, setPlaying] = useState<boolean>(false);

    const { howlVolume, ...volumeData } = useAudioVolume(howlRef.current);

    const bindEvents = useCallback(() => {
        if (howlRef.current) {
            howlRef.current.off('play').on('play', () => setPlaying(true));
            howlRef.current.off('pause').on('pause', () => setPlaying(false));
            howlRef.current.off('stop').on('stop', () => setPlaying(false));
        }
    }, []);

    const playAudio = useCallback(
        (track: Asset, time: number) => {
            if (!howlRef.current || track.id !== trackRef.current?.id) {
                trackRef.current = track;
                howlRef.current?.unload();
                howlRef.current = new Howl({
                    src: getAssetUrl(track.path),
                    format: track.name.split('.').pop()
                });
                bindEvents();
            }
            howlRef.current?.volume(howlVolume);
            howlRef.current?.seek(time);
            if (!howlRef.current?.playing()) {
                howlRef.current?.play();
            }
        },
        [howlVolume, bindEvents]
    );

    const stopAudio = useCallback(() => {
        howlRef.current?.stop();
    }, []);

    useEffect(() => {
        socket.off('audioPlay').on('audioPlay', ({ asset, time }) => {
            playAudio(asset, time ?? 0);
        });
        socket.off('audioStop').on('audioStop', () => {
            stopAudio();
        });
    }, [playAudio, socket, stopAudio]);

    useEffect(
        () => () => {
            stopAudio();
            howlRef.current?.unload();
            howlRef.current = null;
        },
        [stopAudio]
    );

    const contextValue = useMemo(
        () => ({
            initialized: true,
            playing,
            playAudio,
            stopAudio,
            ...volumeData
        }),
        // biome-ignore lint/correctness/useExhaustiveDependencies: volumeData is falsly being pointed as changing every render except it's not
        [playing, playAudio, stopAudio, volumeData]
    );

    return (
        <AudioClientContext value={contextValue}>{children}</AudioClientContext>
    );
};

export const useAudioClient = () => {
    const context = useContext(AudioClientContext);
    if (!context?.initialized) {
        throw new Error(
            'useAudioClient must be used within an AudioClientProvider'
        );
    }
    return context;
};
