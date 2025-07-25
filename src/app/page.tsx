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

type VideoItem = {
  id: number;
  title: string;
  src: string;
};

export default function Home() {
  const videos: VideoItem[] = [
    { id: 1, title: "Vídeo 1 - Natureza", src: "./assets/video01.mp4" },
    { id: 2, title: "Vídeo 2 - Cidade", src: "./assets/video02.mp4" },
  ];

  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const video = videoRef.current;
    if (!video) return;

    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    return () => {
      video.pause();
    };
  }, [isMounted, currentVideoIndex]);

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

  const changeVideo = (index: number) => {
    if (index < 0 || index >= videos.length) return;
    setCurrentVideoIndex(index);
  };

  const nextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  const previousVideo = () => {
    const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    setCurrentVideoIndex(prevIndex);
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

  if (!isMounted) return null;

  return (
    <div className="w-screen h-screen bg-[#222] flex justify-center items-start p-6 gap-6">
      {/* Lista de vídeos */}
      <aside className="w-48 bg-[#333] rounded-md p-4 flex flex-col gap-3">
        <h2 className="text-white font-semibold mb-2">Playlist</h2>
        {videos.map((video, index) => (
          <button
            key={video.id}
            className={`text-left px-3 py-2 rounded-md transition ${
              index === currentVideoIndex
                ? "bg-blue-600 text-white font-bold"
                : "text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => changeVideo(index)}
            aria-current={index === currentVideoIndex ? "true" : undefined}
          >
            {video.title}
          </button>
        ))}
      </aside>

      {/* Player principal */}
      <div className="w-[360px] bg-[#888] p-4 flex flex-col gap-4 items-center rounded-md shadow-md relative">
        <div className="relative w-full">
          <video
            ref={videoRef}
            src={videos[currentVideoIndex].src}
            className="w-full rounded-md"
            preload="metadata"
            controls={false}
          />

          {/* Botões de adiantar/voltar 10s */}
          <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
            <button
              onClick={() => skipTime(-10)}
              className="pointer-events-auto flex items-center gap-2 bg-gradient-to-r from-[#444] to-[#222] bg-opacity-70 text-white px-4 py-2 rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg"
              aria-label="Voltar 10 segundos"
            >
              <FaBackward size={20} />
              <span className="font-semibold text-sm">10s</span>
            </button>

            <button
              onClick={() => skipTime(10)}
              className="pointer-events-auto flex items-center gap-2 bg-gradient-to-l from-[#444] to-[#222] bg-opacity-70 text-white px-4 py-2 rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg"
              aria-label="Avançar 10 segundos"
            >
              <span className="font-semibold text-sm">10s</span>
              <FaForward size={20} />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
            aria-label="Tela cheia"
          >
            <FaExpand className="text-black" />
          </button>
        </div>

        {/* Botões principais */}
        <div className="flex gap-6 items-center">
          <button
            onClick={previousVideo}
            aria-label="Vídeo anterior"
            className="text-black hover:text-gray-700 transition"
          >
            <FaBackward size={20} />
          </button>
          <button onClick={playPause} aria-label={playing ? "Pausar" : "Reproduzir"}>
            {playing ? (
              <FaPause className="text-black" size={24} />
            ) : (
              <FaPlay className="text-black" size={24} />
            )}
          </button>
          <button
            onClick={nextVideo}
            aria-label="Próximo vídeo"
            className="text-black hover:text-gray-700 transition"
          >
            <FaForward size={20} />
          </button>
        </div>

        {/* Barra de progresso (manual apenas) */}
        <input
          className="w-full"
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={(e) => {
            const video = videoRef.current;
            const newTime = Number(e.target.value);
            if (video) {
              video.currentTime = newTime;
            }
            setCurrentTime(newTime);
          }}
          aria-label="Barra de progresso do vídeo"
        />

        {/* Controle de volume */}
        <div className="flex items-center gap-2 w-full">
          <button onClick={toggleMute} aria-label={muted || volume === 0 ? "Ativar som" : "Mudo"}>
            {muted || volume === 0 ? (
              <FaVolumeMute className="text-black" size={20} />
            ) : (
              <FaVolumeUp className="text-black" size={20} />
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
            aria-label="Controle de volume"
          />
        </div>
      </div>
    </div>
  );
}
