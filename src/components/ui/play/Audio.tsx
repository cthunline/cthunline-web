import React, { useEffect, useRef, useState } from 'react';
import { Box, Slider } from '@mui/material';
import {
    MdVolumeMute,
    MdVolumeUp,
    MdVolumeOff
} from 'react-icons/md';

import Api from '../../../services/api';
import { usePlay } from '../../contexts/Play';

import './Audio.css';

const Audio = () => {
    const { audioData } = usePlay();

    const [volumePercent, setVolumePercent] = useState<number>(100);
    const [isMute, setIsMute] = useState<boolean>(false);

    const audioElement = useRef<HTMLAudioElement>() as (
        React.MutableRefObject<HTMLAudioElement>
    );

    const onVolumeChange = (e: Event, value: number | number[]) => {
        setVolumePercent(value as number);
        if (isMute) {
            setIsMute(false);
        }
    };

    useEffect(() => {
        if (audioData && audioData.playing) {
            const { path, time } = audioData;
            const url = Api.getAssetUrl(path);
            if (audioElement.current.src !== url) {
                audioElement.current.src = url;
                audioElement.current.currentTime = time;
                audioElement.current.play();
            }
        } else {
            audioElement.current.pause();
        }
    }, [
        audioData
    ]);

    useEffect(() => {
        audioElement.current.volume = isMute ? 0 : (
            volumePercent / 100
        );
    }, [
        volumePercent,
        isMute
    ]);

    const getIcon = () => {
        if (isMute) {
            return (
                <MdVolumeMute
                    className="clickable"
                    size={45}
                    onClick={() => setIsMute(false)}
                />
            );
        }
        return audioData?.playing ? (
            <MdVolumeUp
                className="clickable"
                size={45}
                onClick={() => setIsMute(true)}
            />
        ) : (
            <MdVolumeOff
                className="clickable"
                size={45}
                onClick={() => setIsMute(true)}
            />
        );
    };

    return (
        <Box className="audio">
            <Box className="flex row center">
                {getIcon()}
                <Slider
                    value={volumePercent}
                    onChange={onVolumeChange}
                    min={0}
                    max={100}
                />
            </Box>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
                ref={audioElement}
                className="hidden"
                crossOrigin="anonymous"
                autoPlay={false}
            />
        </Box>
    );
};

export default Audio;
