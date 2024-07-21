import type { Howl } from 'howler';
import { useCallback, useEffect, useState } from 'react';

export interface VolumeData {
    howlVolume: number;
    volumePercent: number;
    muted: boolean;
}

export const defaultVolumeData: VolumeData = {
    howlVolume: 1,
    volumePercent: 100,
    muted: false
};

export interface UseAudioVolumeExport extends VolumeData {
    setVolumePercent: (volumePercent: number) => void;
    toggleMute: () => void;
}

export const defaultUseAudioVolumeExport: UseAudioVolumeExport = {
    ...defaultVolumeData,
    setVolumePercent: () => {},
    toggleMute: () => {}
};

export const useAudioVolume = (howl: Howl | null): UseAudioVolumeExport => {
    const [volumeData, setVolumeData] = useState<VolumeData>(defaultVolumeData);

    const setVolumePercent = useCallback((volumePercent: number) => {
        setVolumeData((prev) => ({
            ...prev,
            howlVolume: (volumePercent / 100) ** 2,
            volumePercent
        }));
    }, []);

    const toggleMute = useCallback(() => {
        setVolumeData((prev) => ({
            ...prev,
            muted: !prev.muted
        }));
    }, []);

    useEffect(() => {
        howl?.volume(volumeData.howlVolume);
    }, [howl, volumeData.howlVolume]);

    useEffect(() => {
        howl?.mute(volumeData.muted);
    }, [howl, volumeData.muted]);

    return {
        ...volumeData,
        setVolumePercent,
        toggleMute
    };
};
