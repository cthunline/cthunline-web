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

const getTimeText = (time: number) => {
    let minutes = 0;
    let seconds = 0;
    if (time && !Number.isNaN(time)) {
        minutes = Math.floor(time / 60);
        seconds = Math.round(time % 60);
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface AudioOptions {
    repeatPlaylist: boolean;
    repeatTrack: boolean;
    shuffle: boolean;
}

const defaultOptions: AudioOptions = {
    repeatPlaylist: true,
    repeatTrack: false,
    shuffle: false
};

interface AudioTimeStatus {
    timePercent: number;
    timeText: string;
    durationText: string;
}

const defaultTimeStatus: AudioTimeStatus = {
    timePercent: 0,
    timeText: '0:00',
    durationText: '0:00'
};

interface AudioMasterProviderProps {
    children: JSX.Element | JSX.Element[];
    socket: PlaySocket;
}

interface AudioMasterContextData
    extends Omit<UseAudioVolumeExport, 'howlVolume'> {
    howl: Howl | null;
    timeStatus: AudioTimeStatus;
    options: AudioOptions;
    restart: () => void;
    setTime: (time: number) => void;
    updateOptions: (opts: Partial<AudioOptions>) => void;
    setPlaylist: (playlist: Asset[]) => void;
    selectTrack: (track: Asset) => void;
    track: Asset | null;
}

const defaultContextData: AudioMasterContextData = {
    howl: null,
    timeStatus: defaultTimeStatus,
    options: defaultOptions,
    restart: () => {},
    setTime: () => {},
    updateOptions: () => {},
    ...defaultUseAudioVolumeExport,
    setPlaylist: () => {},
    selectTrack: () => {},
    track: null
};

const AudioMasterContext =
    createContext<AudioMasterContextData>(defaultContextData);

export const AudioMasterProvider = ({
    children,
    socket
}: AudioMasterProviderProps) => {
    const howlRef = useRef<Howl | null>(null);
    const frameRef = useRef<number>();
    const loadedTrackRef = useRef<Asset | null>(null);
    const [track, setTrack] = useState<Asset | null>(null);
    const [playlist, setPlaylist] = useState<Asset[]>([]);
    const [options, setOptions] = useState<AudioOptions>(defaultOptions);
    const [timeStatus, setTimeStatus] =
        useState<AudioTimeStatus>(defaultTimeStatus);

    const volumeData = useAudioVolume(howlRef.current);

    const emitAudioPlay = useCallback(
        (asset: Asset, time: number) => {
            socket?.emit('audioPlay', {
                assetId: asset.id,
                time
            });
        },
        [socket]
    );

    const emitAudioStop = useCallback(() => {
        socket?.emit('audioStop');
    }, [socket]);

    const selectTrack = useCallback(
        ({ id: assetId }: Asset) => {
            const asset = playlist.find(({ id }) => id === assetId);
            if (asset) {
                setTrack(asset);
            }
        },
        [playlist]
    );

    const restart = useCallback(() => {
        if (track && howlRef.current) {
            howlRef.current.seek(0);
            if (!howlRef.current.playing()) {
                howlRef.current.play();
            }
            emitAudioPlay(track, howlRef.current.seek());
        }
    }, [track, howlRef, emitAudioPlay]);

    const setTime = useCallback(
        (time: number) => {
            if (track && howlRef.current) {
                howlRef.current.seek(time);
                if (howlRef.current.playing()) {
                    emitAudioPlay(track, howlRef.current.seek());
                }
            }
        },
        [emitAudioPlay, track]
    );

    const updateOptions = useCallback((opts: Partial<AudioOptions>) => {
        setOptions((prev) => ({
            ...prev,
            ...opts
        }));
    }, []);

    const playNext = useCallback(() => {
        if (track) {
            const currentAudioAssetIndex = playlist.findIndex(
                ({ id }) => track.id === id
            );
            if (currentAudioAssetIndex >= 0) {
                if (options.repeatTrack) {
                    restart();
                } else {
                    let nextIndex = currentAudioAssetIndex + 1;
                    if (
                        options.repeatPlaylist &&
                        nextIndex > playlist.length - 1
                    ) {
                        nextIndex = 0;
                    }
                    if (nextIndex === currentAudioAssetIndex) {
                        restart();
                    } else {
                        const nextAsset = playlist[nextIndex];
                        if (nextAsset) {
                            const asset = playlist.find(
                                ({ id }) => id === nextAsset.id
                            );
                            if (asset) {
                                setTrack(asset);
                            }
                        }
                    }
                }
            }
        }
    }, [options, playlist, restart, track]);

    useEffect(() => {
        const animate = () => {
            if (track && howlRef.current) {
                const position = howlRef.current.seek();
                const duration = howlRef.current.duration();
                const timePercent = duration
                    ? Math.floor((position / duration) * 100)
                    : 0;
                setTimeStatus({
                    timePercent,
                    timeText: getTimeText(position),
                    durationText: getTimeText(duration ?? 0)
                });
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [track, howlRef]);

    const bindEvents = useCallback(() => {
        if (howlRef.current) {
            howlRef.current.off('play').on('play', () => {
                if (loadedTrackRef.current && howlRef.current) {
                    emitAudioPlay(
                        loadedTrackRef.current,
                        howlRef.current.seek()
                    );
                }
            });
            howlRef.current.off('pause').on('pause', emitAudioStop);
            howlRef.current.off('stop').on('stop', emitAudioStop);
            howlRef.current.off('end').on('end', playNext);
        }
    }, [emitAudioStop, playNext, emitAudioPlay]);

    useEffect(() => {
        if (track) {
            if (track.id !== loadedTrackRef.current?.id) {
                loadedTrackRef.current = track;
                if (howlRef.current) {
                    howlRef.current.unload();
                }
                howlRef.current = new Howl({
                    src: getAssetUrl(track.path),
                    format: track.name.split('.').pop(),
                    autoplay: true,
                    volume: volumeData.howlVolume,
                    mute: volumeData.muted
                });
                bindEvents();
            }
        } else if (!track && howlRef.current) {
            howlRef.current?.unload();
            emitAudioStop();
        }
    }, [
        bindEvents,
        emitAudioStop,
        track,
        volumeData.howlVolume,
        volumeData.muted
    ]);

    useEffect(() => {
        bindEvents();
    }, [bindEvents]);

    const contextValue = useMemo(
        () => ({
            howl: howlRef.current,
            timeStatus,
            setPlaylist,
            options,
            updateOptions,
            ...volumeData,
            setTime,
            restart,
            track,
            selectTrack
        }),
        [
            timeStatus,
            options,
            updateOptions,
            volumeData,
            setTime,
            restart,
            track,
            selectTrack
        ]
    );

    return (
        <AudioMasterContext.Provider value={contextValue}>
            {children}
        </AudioMasterContext.Provider>
    );
};

export function useAudioMaster() {
    const context = useContext(AudioMasterContext);
    if (!context) {
        throw new Error(
            'useAudioMaster must be used within an AudioMasterProvider'
        );
    }
    return context;
}
