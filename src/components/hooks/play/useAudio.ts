import { useState, useCallback } from 'react';

import {
    PlaySocket,
    AudioData,
    Asset
} from '../../../types';

export interface AudioHookExport {
    audioData: AudioData | null;
    playAudio: (asset: Asset, time: number) => void;
    stopAudio: () => void;
}

export const defaultAudioHookExport: AudioHookExport = {
    audioData: null,
    playAudio: () => {},
    stopAudio: () => {}
};

const useAudio = (socket: PlaySocket | null) => {
    const [audioData, setAudioData] = useState<AudioData | null>(null);

    const setAudioTrack = (asset: Asset, time: number) => {
        setAudioData({
            ...asset,
            time,
            playing: true
        });
    };

    const clearAudioTrack = () => {
        setAudioData(null);
    };

    const playAudio = useCallback((asset: Asset, time: number) => {
        socket?.emit('audioPlay', {
            assetId: asset.id,
            time
        });
    }, [
        socket
    ]);

    const stopAudio = useCallback(() => {
        socket?.emit('audioStop');
    }, [
        socket
    ]);

    return {
        audioData,
        setAudioTrack,
        clearAudioTrack,
        playAudio,
        stopAudio
    };
};

export default useAudio;