"use client";

import { useRef, useState, useEffect } from "react";
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
} from "react-icons/fa";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false); // para evitar Hydration mismatch
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isMounted]);

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, video.duration));
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Math.max(0, Math.min(value, 1));
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuted = !muted;
    video.muted = newMuted;
    setMuted(newMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  if (!isMounted) return null; // NÃO renderiza nada até montar no cliente

  return (
    <div className="w-screen h-screen bg-[#222] flex justify-center items-center">
      <div className="w-[360px] bg-[#888] p-4 flex flex-col gap-4 items-center rounded-md shadow-md relative">
        <div className="relative w-full">
          <video
            ref={videoRef}
            src="./assets/video01.mp4"
            className="w-full rounded-md"
            preload="metadata"
            controls={false}
          />
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <FaExpand className="text-black" />
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => skipTime(-10)}>
            <FaBackward className="text-black cursor-pointer" />
          </button>
          <button onClick={playPause}>
            {playing ? (
              <FaPause className="text-black cursor-pointer" />
            ) : (
              <FaPlay className="text-black cursor-pointer" />
            )}
          </button>
          <button onClick={() => skipTime(10)}>
            <FaForward className="text-black cursor-pointer" />
          </button>
        </div>

        {/* Barra de progresso funcionando */}
        <input
          className="w-full"
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onInput={(e) => {
            const video = videoRef.current;
            const newTime = Number((e.target as HTMLInputElement).value);
            if (video) {
              video.currentTime = newTime;
            }
            setCurrentTime(newTime);
          }}
        />

        <div className="flex items-center gap-2 w-full">
          <button onClick={toggleMute}>
            {muted || volume === 0 ? (
              <FaVolumeMute className="text-black" />
            ) : (
              <FaVolumeUp className="text-black" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
