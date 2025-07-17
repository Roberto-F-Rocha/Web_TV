"use client";

import { useRef, useState, useEffect } from "react";
import { FaBackward, FaForward, FaPause, FaPlay, FaVolumeUp, FaExpand } from "react-icons/fa";

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Atualiza a duração do vídeo e o tempo atual
  useEffect(() => {
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
  }, []);

  // Define o tempo atual do vídeo (clamp evita passar do tempo total)
  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedTime = Math.max(0, Math.min(time, duration));
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  };

  // Inicia ou pausa o vídeo
  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  // Ajusta o volume do vídeo
  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const vol = Math.max(0, Math.min(value, 1));
    video.volume = vol;
    setVolume(vol);
  };

  // Ativa o modo tela cheia
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className="w-screen h-screen bg-[#222222] flex justify-center items-center">
      <div className="w-[360px] bg-[#888888] p-4 flex flex-col gap-4 items-center rounded-md shadow-md relative">
        
        <div className="relative w-full">
          <video ref={videoRef} className="w-full rounded-md" src="./assets/video01.mp4" />

          {/* Botão Play/Pause sobreposto no vídeo */}
          <button
            onClick={playPause}
            className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-200 transition flex items-center gap-2"
          >
            {playing ? (
              <>
                <FaPause className="text-black" />
                <span className="text-black text-sm">Pausar</span>
              </>
            ) : (
              <>
                <FaPlay className="text-black" />
                <span className="text-black text-sm">Tocar</span>
              </>
            )}
          </button>

          {/* Botão de tela cheia */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <FaExpand className="text-black" />
          </button>
        </div>

        {/* Controles: Voltar, Play/Pause, Avançar */}
        <div className="flex gap-4 items-center">
          <button onClick={() => configCurrentTime(currentTime - 10)}>
            <FaBackward className="text-black cursor-pointer" />
          </button>
          <button onClick={playPause}>
            {playing ? (
              <FaPause className="text-black cursor-pointer" />
            ) : (
              <FaPlay className="text-black cursor-pointer" />
            )}
          </button>
          <button onClick={() => configCurrentTime(currentTime + 10)}>
            <FaForward className="text-black cursor-pointer" />
          </button>
        </div>

        {/* Barra de progresso */}
        <input
          className="w-full"
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={(e) => configCurrentTime(Number(e.target.value))}
        />

        {/* Controle de volume */}
        <div className="flex items-center gap-2 w-full">
          <FaVolumeUp className="text-black" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
