import { ActionIcon, Box, Group, Slider } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import {
    IoVolumeOff,
    IoVolumeLow,
    IoVolumeMedium,
    IoVolumeHigh,
    IoVolumeMute
} from 'react-icons/io5';

import { getAssetUrl } from '../../../services/api.js';
import { usePlay } from '../../contexts/Play.js';

const Audio = () => {
    const { audioData } = usePlay();

    const [volumePercent, setVolumePercent] = useState<number>(100);
    const [isMute, setIsMute] = useState<boolean>(false);

    const audioElement =
        useRef<HTMLAudioElement>() as React.MutableRefObject<HTMLAudioElement>;

    const onVolumeChange = (value: number) => {
        setVolumePercent(value);
        if (isMute) {
            setIsMute(false);
        }
    };

    useEffect(() => {
        if (audioData && audioData.playing) {
            const { path, time } = audioData;
            const url = getAssetUrl(path);
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
        <Box
            pos="absolute"
            top="10px"
            right="30px"
            w="150px"
            style={{ zIndex: 0 }}
        >
            <Group align="center" justify="center" gap="0.5rem">
                <ActionIcon onClick={() => setIsMute(!isMute)}>
                    {getIcon()}
                </ActionIcon>
                <Slider
                    value={volumePercent}
                    onChange={onVolumeChange}
                    min={0}
                    max={100}
                />
            </Group>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
                ref={audioElement}
                autoPlay={false}
                style={{ display: 'none' }}
            />
        </Box>
    );
};

export default Audio;
