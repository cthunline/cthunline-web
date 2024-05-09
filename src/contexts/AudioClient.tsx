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

import { type PlaySocket, type Asset } from '../types/index.js';
import { getAssetUrl } from '../services/api.js';
import {
    useAudioVolume,
    type UseAudioVolumeExport,
    defaultUseAudioVolumeExport
} from '../hooks/useAudioVolume.js';

interface AudioClientProviderProps {
    children: JSX.Element | JSX.Element[];
    socket: PlaySocket;
}

interface AudioClientContextData
    extends Omit<UseAudioVolumeExport, 'howlVolume'> {
    playing: boolean;
    playAudio: (track: Asset, time: number) => void;
    stopAudio: () => void;
}

const defaultContextData: AudioClientContextData = {
    playing: false,
    playAudio: () => {},
    stopAudio: () => {},
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

    const bindEvents = () => {
        if (howlRef.current) {
            howlRef.current.off('play').on('play', () => setPlaying(true));
            howlRef.current.off('pause').on('pause', () => setPlaying(false));
            howlRef.current.off('stop').on('stop', () => setPlaying(false));
        }
    };

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
        [howlVolume]
    );

    const stopAudio = useCallback(() => {
        howlRef.current?.stop();
    }, []);

    useEffect(() => {
        socket.off('audioPlay').on('audioPlay', ({ asset, time }) => {
            playAudio(asset, time);
        });
        socket.off('audioStop').on('audioStop', () => {
            stopAudio();
        });
    }, [playAudio, socket, stopAudio]);

    const contextValue = useMemo(
        () => ({
            playing,
            playAudio,
            stopAudio,
            ...volumeData
        }),
        [playing, playAudio, stopAudio, volumeData]
    );

    return (
        <AudioClientContext.Provider value={contextValue}>
            {children}
        </AudioClientContext.Provider>
    );
};

export function useAudioClient() {
    const context = useContext(AudioClientContext);
    if (!context) {
        throw new Error(
            'useAudioClient must be used within an AudioClientProvider'
        );
    }
    return context;
}
