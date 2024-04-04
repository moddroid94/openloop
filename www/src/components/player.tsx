"use client"

import ReactHowler from 'react-howler'
import { useEffect, useRef, useState } from 'react'

// components/AudioPlayer.tsx

import { PlayerControls } from "@/components/playercontrols";



type Props = {
    url: string;
    title: string;
    author: string;
    thumbnail: string;
}
export const Player = ({ url, title, author, thumbnail}: Props) => {
    const playerRef = useRef<ReactHowler | null>(null);
    

    const [playing, setPlaying] = useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.5);
    const [progress, setProgress] = useState<number>(0); // 0 for playing - 1 for ended, which triggers progressbar reset
    const [loop, setLoop] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);

    // event handlers for custom controls

    const handlePlay = () => {
        setPlaying(true);
        setProgress(0)
    };

    const handlePause = () => {
        setPlaying(false);
    };

    const handleEnd = () => {
        setProgress(1)
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
    };

    const toggleMute = () => {
        setMuted((prevMuted) => !prevMuted);
    };

    const handleLoad = () => {
        handleDuration(playerRef.current.howler.duration())
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const toggleLoop = () => {
        setLoop((prevLoop) => !prevLoop);
    };
    
    return (
        <div className='w-full'>
            <ReactHowler
                ref={playerRef}
                src={url}
                playing={playing}
                volume={volume}
                mute={muted}
                loop={loop}
                onLoad={handleLoad}
                onEnd={handleEnd}
                onStop={handlePause}
                onPause={handlePause}
            />
            <div className="shadow">
            
            <PlayerControls
                playerRef={playerRef}
                playing={playing}
                volume={volume}
                muted={muted}
                progress={progress}
                duration={duration}
                loop={loop}
                // event handler props
                toggleMute={toggleMute}
                handlePlay={handlePlay}
                toggleLoop={toggleLoop}
                handlePause={handlePause}
                handleVolumeChange={handleVolumeChange}
            />
            </div>
        </div>
    )
}
