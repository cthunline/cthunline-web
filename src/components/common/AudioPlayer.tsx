import {
    ActionIcon,
    Group,
    type GroupProps,
    Progress,
    Slider,
    Stack,
    Tooltip
} from '@mantine/core';
import {
    BsPauseFill,
    BsPlayFill,
    BsRepeat,
    BsRepeat1,
    BsShuffle
} from 'react-icons/bs';
import {
    IoVolumeHigh,
    IoVolumeLow,
    IoVolumeMedium,
    IoVolumeMute,
    IoVolumeOff
} from 'react-icons/io5';

import { useAudioMaster } from '../../contexts/AudioMaster.js';
import { useLocaleStore } from '../../stores/locale.js';

interface AudioVolumeIconProps {
    playing: boolean;
    muted: boolean;
    percent: number;
}

const AudioVolumeIcon = ({ playing, muted, percent }: AudioVolumeIconProps) => {
    if (muted) {
        return <IoVolumeMute />;
    }
    if (playing) {
        if (percent > 66) {
            return <IoVolumeHigh />;
        }
        if (percent > 33) {
            return <IoVolumeMedium />;
        }
        return <IoVolumeLow />;
    }
    return <IoVolumeOff />;
};

interface AudioVolumeProps extends Omit<GroupProps, 'onChange'> {
    playing: boolean;
    percent: number;
    muted: boolean;
    onChange: (volume: number) => void;
    onToggleMute: () => void;
}

const AudioVolume = ({
    playing,
    percent,
    muted,
    onChange,
    onToggleMute,
    ...rest
}: AudioVolumeProps) => (
    <Group align="center" justify="center" gap="1rem" {...rest}>
        <ActionIcon size="sm" onClick={onToggleMute}>
            <AudioVolumeIcon
                playing={playing}
                muted={muted}
                percent={percent}
            />
        </ActionIcon>
        <Slider
            flex="1 0"
            value={percent}
            onChange={onChange}
            min={0}
            max={100}
        />
    </Group>
);

interface AudioOptionButtonProps {
    tooltip: string;
    active: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
}

const AudioOptionButton = ({
    tooltip,
    active,
    onToggle,
    icon
}: AudioOptionButtonProps) => (
    <Tooltip label={tooltip} position="bottom">
        <ActionIcon
            variant={active ? 'filled' : 'subtle'}
            size="sm"
            onClick={onToggle}
        >
            {icon}
        </ActionIcon>
    </Tooltip>
);

const AudioPlayer = () => {
    const T = useLocaleStore(({ T }) => T);

    const {
        howl,
        setTime,
        timeStatus,
        volumePercent,
        setVolumePercent,
        muted,
        toggleMute,
        options,
        updateOptions
    } = useAudioMaster();

    const onTogglePlay = () => {
        if (howl) {
            if (howl.playing()) {
                howl.pause();
            } else {
                howl.play();
            }
        }
    };

    const onProgressClick = (e: React.MouseEvent<HTMLElement>) => {
        if (howl) {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const clickedPosition = e.clientX - left;
            const newTime = (clickedPosition / width) * howl.duration();
            setTime(newTime);
        }
    };

    return (
        <Stack>
            <Group align="center" justify="center">
                <ActionIcon variant="filled" size="sm" onClick={onTogglePlay}>
                    {howl?.playing() ? <BsPauseFill /> : <BsPlayFill />}
                </ActionIcon>
                <Progress
                    flex="1 0"
                    value={timeStatus.timePercent}
                    size="lg"
                    style={{ cursor: 'pointer' }}
                    onClick={onProgressClick}
                />
                {`${timeStatus.timeText} / ${timeStatus.durationText}`}
            </Group>
            <Group align="center" justify="center">
                <AudioVolume
                    playing={!!howl?.playing()}
                    percent={volumePercent}
                    muted={muted}
                    onChange={setVolumePercent}
                    onToggleMute={toggleMute}
                    flex="1 0"
                />
                <Group flex="1 0" align="center" justify="end">
                    <AudioOptionButton
                        tooltip={T('widget.jukebox.shuffle')}
                        active={options.shuffle}
                        icon={<BsShuffle />}
                        onToggle={() => {
                            updateOptions({
                                shuffle: !options.shuffle
                            });
                        }}
                    />
                    <AudioOptionButton
                        tooltip={T('widget.jukebox.repeatTrack')}
                        active={options.repeatTrack}
                        icon={<BsRepeat1 />}
                        onToggle={() => {
                            const newValue = !options.repeatTrack;
                            updateOptions({
                                repeatTrack: newValue,
                                ...(newValue
                                    ? {
                                          repeatPlaylist: false
                                      }
                                    : {})
                            });
                        }}
                    />
                    <AudioOptionButton
                        tooltip={T('widget.jukebox.repeatPlaylist')}
                        active={options.repeatPlaylist}
                        icon={<BsRepeat />}
                        onToggle={() => {
                            const newValue = !options.repeatPlaylist;
                            updateOptions({
                                repeatPlaylist: newValue,
                                ...(newValue
                                    ? {
                                          repeatTrack: false
                                      }
                                    : {})
                            });
                        }}
                    />
                </Group>
            </Group>
        </Stack>
    );
};

AudioPlayer.Volume = AudioVolume;

export default AudioPlayer;
