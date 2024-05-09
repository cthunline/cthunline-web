import { ActionIcon, Box, Group, Slider } from '@mantine/core';
import {
    IoVolumeOff,
    IoVolumeLow,
    IoVolumeMedium,
    IoVolumeHigh,
    IoVolumeMute
} from 'react-icons/io5';

import { useAudioClient } from '../../../contexts/AudioClient.js';

const AudioClientVolume = () => {
    const { playing, muted, toggleMute, volumePercent, setVolumePercent } =
        useAudioClient();

    const getIcon = () => {
        if (muted) {
            return <IoVolumeMute size={40} />;
        }
        if (playing) {
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
        <Box pos="absolute" top={0} right={0} w="10rem" style={{ zIndex: 0 }}>
            <Group align="center" justify="center" gap="1rem">
                <ActionIcon onClick={toggleMute}>{getIcon()}</ActionIcon>
                <Slider
                    flex="1 0"
                    value={volumePercent}
                    onChange={setVolumePercent}
                    min={0}
                    max={100}
                    styles={{
                        label: {
                            bottom: 'calc(-2.5rem * var(--mantine-scale))',
                            top: 'unset'
                        }
                    }}
                />
            </Group>
        </Box>
    );
};

export default AudioClientVolume;
