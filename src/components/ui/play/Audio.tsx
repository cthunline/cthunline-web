import React, { useEffect, useRef, useState } from 'react';
import { Box, Slider } from '@mui/material';
import {
    IoVolumeOff,
    IoVolumeLow,
    IoVolumeMedium,
    IoVolumeHigh,
    IoVolumeMute
} from 'react-icons/io5';

import Api from '../../../services/api';
import { usePlay } from '../../contexts/Play';

import './Audio.css';

const Audio = () => {
    const { audioData } = usePlay();

    const [volumePercent, setVolumePercent] = useState<number>(100);
    const [isMute, setIsMute] = useState<boolean>(false);

    const audioElement =
        useRef<HTMLAudioElement>() as React.MutableRefObject<HTMLAudioElement>;

    const onVolumeChange = (_e: Event, value: number | number[]) => {
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
            }
            audioElement.current.currentTime = time;
            audioElement.current.play();
        } else {
            audioElement.current.pause();
        }
    }, [audioData]);

    useEffect(() => {
        audioElement.current.volume = isMute ? 0 : volumePercent / 100;
    }, [volumePercent, isMute]);

    const getIcon = () => {
        if (isMute) {
            return <IoVolumeMute size={40} />;
        }
        if (audioData?.playing) {
            if (volumePercent > 66) {
                return <IoVolumeHigh size={40} />;
            }
            if (volumePercent > 33) {
                return <IoVolumeMedium size={40} />;
            }
            return <IoVolumeLow size={40} />;
        }
        return <IoVolumeOff size={40} />;
    };

    return (
        <Box className="audio">
            <Box className="flex row center">
                <Box
                    className="clickable flex center mr-10"
                    onClick={() => setIsMute(!isMute)}
                >
                    {getIcon()}
                </Box>
                <Slider
                    value={volumePercent}
                    onChange={onVolumeChange}
                    min={0}
                    max={100}
                />
            </Box>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio ref={audioElement} className="hidden" autoPlay={false} />
        </Box>
    );
};

export default Audio;
