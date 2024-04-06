"use client"

import { useEffect, useRef, useState } from "react";
import { Duration } from "@/components/durations";

import { CiPlay1, CiPause1 } from "react-icons/ci";
import { VscMute, VscUnmute } from "react-icons/vsc";
import { ImLoop } from "react-icons/im";
import { IoPlaySkipBack, IoPlaySkipForward } from "react-icons/io5";
import { AudioFile } from "./player";
import { capitalizeStr } from '@/lib/utils';


type Props = {
  playerRef: any;
  audio: AudioFile
  playing: boolean;
  loop: boolean;
  volume: number;
  muted: boolean;
  progress: number;
  duration: number;

  handlePlay: () => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  handlePause: () => void;
  handleVolumeChange: (newVolume: number) => void;
  handleSkip: (direction: string) => void
};

export const PlayerControls = ({
    playerRef,
    audio,
    loop,
    playing,
    volume,
    muted,
    progress,
    duration,
    handlePlay,
    toggleLoop,
    handlePause,
    handleVolumeChange,
    toggleMute,
    handleSkip,
}: Props) => {
    const [played, setPlayed] = useState<number>(0);
    const [seeking, setSeeking] = useState<boolean>(false);
    const requestId = useRef<number>()

    const togglePlayAndPause = () => {
        if (playing) {
        handlePause();
        } else {
        handlePlay();
        }
    };

    const handleSeekMouseDown = (e: any) => {
        setSeeking(true);
    };
    
    const handleSeekChange = (e: any) => {
        setPlayed(parseFloat(e.target.value));
    };
    
    const handleSeekMouseUp = (e: any) => {
        setPlayed(parseFloat(e.target.value))
        playerRef.current?.howler.seek(parseFloat(e.target.value));
        
        setSeeking(false);
    };

    const handleProgress = () => {
        setPlayed(playerRef.current.howler.seek())
        progress = played
        requestId.current = requestAnimationFrame(handleProgress)
    }
    const handleChangeInVolume =  (e: React.ChangeEvent<HTMLInputElement>) => {
        handleVolumeChange(Number(e.target.value));
    };

    const skipFwd = () => {
        handleSkip('fwd')
    }
    const skipBwd = () => {
        handleSkip('bwd')
    }

    useEffect(() => {
        if (progress == 1) {
            if (loop == false) {
                handlePause()
                setPlayed(0)
            }
            
            
        }
    }, [progress]);

    useEffect(() => {
        if (playing && !seeking) {
            requestId.current = requestAnimationFrame(handleProgress)
        }
        return () => {
            cancelAnimationFrame(requestId.current)
        }
    },[playing, seeking])

    return (
    <div className="bg-gray-50  rounded-xl py-2">
        <div className="bg-gray-50 py-4">
            <div className="mb-4 flex gap-x-10 px-10">
                
                <div className="font-bold text-black mx-auto">
                <img className="absolute -translate-x-12 -translate-y-[5.5px] size-9 rounded-full" src={audio?.thumbnail}></img>
                    {capitalizeStr(audio? audio.title : 'None')}
                </div>
            </div>
            <div className="mb-4 flex gap-x-10 px-10">
                {/* duration: time played  */}
                <div className="text-xs text-gray-600 my-auto">
                    <Duration seconds={played} />
                </div>
                {/* progress bar */}
                <div className="flex-1 mx-auto">
                    <input
                    type="range"
                    min={0}
                    max={duration}
                    step="any"
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                    className="w-full h-2 rounded-lg appearance-none  bg-slate-400 accent-gray-900  "
                    />
                </div>
                {/* duration: time left */}
                <div className="text-xs text-gray-600 my-auto">
                    <Duration seconds={duration} />
                </div>
            </div>
            <div className="grid grid-cols-3 items-center ">
                {/* loop button */}
                <div className="flex justify-center">
                    <button
                    className={`font-bold hover:bg-gray-200`}
                    onClick={toggleLoop}
                    >
                    {loop ? <ImLoop className="text-black"/> : <ImLoop className="text-gray-500"/>}
                    </button>
                    
                </div>
                {/* play/pause button */}
                <div className="flex justify-center gap-2">
                    <button
                    className={`p-4 font-bold hover:bg-gray-200`}
                    onClick={skipBwd}
                    >
                    <IoPlaySkipBack className="text-black"/>
                    </button>
                    <button
                    className="focus:outline focus:outline-cyan-500 border border-cyan-500 rounded-md p-4 hover:bg-gray-200"
                    onClick={togglePlayAndPause}
                    >
                    {playing ? <CiPause1 className="text-black"/> : <CiPlay1 className="text-black"/>}
                    </button>
                    <button
                    className={`p-4 font-bold hover:bg-gray-200`}
                    onClick={skipFwd}
                    >
                    <IoPlaySkipForward className="text-black"/>
                    </button>
                </div>
                {/* volume control */}
                <div className="flex justify-center items-center gap-1">

                    {/* mute button */}
                    <button
                    className=" focus:outline focus:outline-cyan-500"
                    onClick={toggleMute}
                    >
                    {muted ? <VscMute className="text-black"/> : <VscUnmute className="text-black"/>}
                    </button>

                    {/* volume slider */}
                    <input
                    type="range"
                    className="w-[50%] h-2 rounded-lg  bg-slate-400 accent-gray-900"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleChangeInVolume}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};
