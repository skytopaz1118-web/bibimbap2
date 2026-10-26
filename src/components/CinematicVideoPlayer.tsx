import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Sliders,
  Film,
  Music,
  Tv,
} from "lucide-react";
import { BIBIMBAP_SCENES, SceneData } from "../data/videoData";
import { audioEngine } from "../services/audioEngine";
import { SteamCanvas } from "./SteamCanvas";
import { BibimbapIllustrationFallback } from "./BibimbapIllustrationFallback";

interface CinematicVideoPlayerProps {
  onSceneChange?: (scene: SceneData) => void;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  onSceneChange,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCinemaScope, setIsCinemaScope] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("Kore");
  const [isGeneratingTts, setIsGeneratingTts] = useState<boolean>(false);
  const [ttsStatus, setTtsStatus] = useState<string>("Ready");
  const [showMixer, setShowMixer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Volume channels
  const [narrationVol, setNarrationVol] = useState<number>(1.0);
  const [bgmVol, setBgmVol] = useState<number>(0.3);

  // Generous durations ensuring full audio narration + comfortable breathing room
  const [sceneDurations] = useState<number[]>([7.0, 7.5, 6.5]);
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0); // 21.0s

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const activeSceneRef = useRef<number>(0);
  const playedSegmentsRef = useRef<Set<number>>(new Set());

  const currentScene = BIBIMBAP_SCENES[currentSceneIndex] || BIBIMBAP_SCENES[0];

  // Map absolute time to scene index
  const getSceneForTime = useCallback((time: number): { index: number; localTime: number } => {
    let accumulated = 0;
    for (let i = 0; i < sceneDurations.length; i++) {
      const dur = sceneDurations[i];
      if (time < accumulated + dur) {
        return { index: i, localTime: time - accumulated };
      }
      accumulated += dur;
    }
    return { index: sceneDurations.length - 1, localTime: sceneDurations[sceneDurations.length - 1] };
  }, [sceneDurations]);

  // Notify parent on scene change
  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(currentScene);
    }
  }, [currentSceneIndex, onSceneChange, currentScene]);

  // Pre-fetch Gemini TTS audio clips on mount or voice change
  const fetchAllNarrationTts = useCallback(async (voiceName: string) => {
    setIsGeneratingTts(true);
    setTtsStatus("Synthesizing studio voice with Gemini TTS...");

    try {
      for (let i = 0; i < BIBIMBAP_SCENES.length; i++) {
        const scene = BIBIMBAP_SCENES[i];
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            segmentId: scene.id,
            text: scene.narrationText,
            voice: voiceName,
            style: "Clear, warm, natural storytelling pace without rush",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.audioBase64) {
            audioEngine.cacheAudio(scene.id, data.audioBase64);
          }
        }
      }
      setTtsStatus("Studio Voice Synced");
    } catch (e) {
      console.warn("Could not pre-fetch TTS:", e);
      setTtsStatus("Using High-Fidelity Audio");
    } finally {
      setIsGeneratingTts(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNarrationTts(selectedVoice);
  }, [fetchAllNarrationTts, selectedVoice]);

  // Play narration safely
  const playCurrentSceneNarration = useCallback((sceneIndex: number) => {
    const scene = BIBIMBAP_SCENES[sceneIndex];
    if (!scene) return;
    audioEngine.playNarration(scene);
  }, []);

  // Main playback loop
  const tick = useCallback(
    (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prevTime) => {
        const nextTime = prevTime + deltaSec * playbackRate;
        const { index: nextSceneIdx } = getSceneForTime(nextTime);

        // Scene transition
        if (nextSceneIdx !== activeSceneRef.current) {
          activeSceneRef.current = nextSceneIdx;
          setCurrentSceneIndex(nextSceneIdx);

          if (!playedSegmentsRef.current.has(nextSceneIdx)) {
            playedSegmentsRef.current.add(nextSceneIdx);
            playCurrentSceneNarration(nextSceneIdx);
          }
        }

        // End of video reached
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          audioEngine.stopAll();
          return totalDuration;
        }

        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [playbackRate, totalDuration, getSceneForTime, playCurrentSceneNarration]
  );

  const startPlayback = () => {
    audioEngine.init();
    audioEngine.resume();
    audioEngine.startAmbientBgm();

    if (currentTime >= totalDuration) {
      setCurrentTime(0);
      setCurrentSceneIndex(0);
      activeSceneRef.current = 0;
      playedSegmentsRef.current.clear();
    }

    lastTimestampRef.current = null;
    setIsPlaying(true);

    const { index: initialSceneIdx } = getSceneForTime(currentTime >= totalDuration ? 0 : currentTime);
    activeSceneRef.current = initialSceneIdx;
    setCurrentSceneIndex(initialSceneIdx);
    playedSegmentsRef.current.add(initialSceneIdx);
    playCurrentSceneNarration(initialSceneIdx);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    audioEngine.stopNarration();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, newTime));
    setCurrentTime(clamped);
    playedSegmentsRef.current.clear();

    const { index: targetSceneIdx } = getSceneForTime(clamped);
    activeSceneRef.current = targetSceneIdx;
    setCurrentSceneIndex(targetSceneIdx);

    if (isPlaying) {
      playedSegmentsRef.current.add(targetSceneIdx);
      playCurrentSceneNarration(targetSceneIdx);
    } else {
      audioEngine.stopNarration();
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setCurrentSceneIndex(0);
    activeSceneRef.current = 0;
    playedSegmentsRef.current.clear();
    if (!isPlaying) {
      startPlayback();
    } else {
      playedSegmentsRef.current.add(0);
      playCurrentSceneNarration(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, tick]);

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const handleNarrationVolumeChange = (val: number) => {
    setNarrationVol(val);
    audioEngine.setNarrationVolume(val);
  };

  const handleBgmVolumeChange = (val: number) => {
    setBgmVol(val);
    audioEngine.setBgmVolume(val);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "KeyM") {
        handleMuteToggle();
      } else if (e.code === "ArrowLeft") {
        handleSeek(currentTime - 2);
      } else if (e.code === "ArrowRight") {
        handleSeek(currentTime + 2);
      } else if (e.code === "Digit1") {
        handleSeek(0);
      } else if (e.code === "Digit2") {
        handleSeek(sceneDurations[0]);
      } else if (e.code === "Digit3") {
        handleSeek(sceneDurations[0] + sceneDurations[1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime, isPlaying, isMuted, sceneDurations]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Calculate start times for acts
  const act1Start = 0;
  const act2Start = sceneDurations[0];
  const act3Start = sceneDurations[0] + sceneDurations[1];

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl transition-all duration-300 ${
        isFullscreen ? "h-screen rounded-none border-none" : ""
      }`}
    >
      {/* 4K Top Bar Badge */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-md shadow-lg flex items-center gap-1.5">
          <Film className="w-3 h-3 text-amber-400 animate-pulse" />
          4K UHD · 60 FPS
        </span>
        <span className="px-2.5 py-1 text-[11px] font-medium tracking-wider text-stone-300 bg-stone-900/70 backdrop-blur-md border border-stone-700/40 rounded-md">
          Act {currentScene.id} of 3
        </span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowSubtitles(!showSubtitles)}
          title="Toggle Subtitles"
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition border ${
            showSubtitles
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-black/40 text-stone-400 border-stone-700/50 hover:bg-black/60"
          }`}
        >
          CC
        </button>
        <button
          onClick={() => setIsCinemaScope(!isCinemaScope)}
          title="Toggle CinemaScope 2.39:1 / 16:9"
          className={`p-2 rounded-lg text-xs font-medium backdrop-blur-md transition border ${
            isCinemaScope
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-black/40 text-stone-300 border-stone-700/50 hover:bg-black/60"
          }`}
        >
          <Tv className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowMixer(!showMixer)}
          title="Audio Engine Mixer"
          className={`p-2 rounded-lg text-xs font-medium backdrop-blur-md transition border ${
            showMixer
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-black/40 text-stone-300 border-stone-700/50 hover:bg-black/60"
          }`}
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Fullscreen (F)"
          className="p-2 rounded-lg bg-black/40 text-stone-300 border border-stone-700/50 hover:bg-black/60 backdrop-blur-md transition"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>

      {/* Video Viewport */}
      <div
        className={`relative w-full overflow-hidden select-none cursor-pointer transition-all duration-500 ${
          isCinemaScope ? "aspect-[21/9]" : "aspect-[16/9]"
        }`}
        onClick={togglePlay}
      >
        {/* Three Scenes with Crossfade */}
        {BIBIMBAP_SCENES.map((scene, idx) => {
          const isActive = currentSceneIndex === idx;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {imageErrors[scene.id] ? (
                <BibimbapIllustrationFallback
                  sceneId={scene.id}
                  className={isActive && isPlaying ? scene.animationClass : "scale-100"}
                />
              ) : (
                <img
                  src={scene.imageSrc}
                  alt={scene.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const stage = Number(target.dataset.fallbackStage || "0");
                    if (stage === 0) {
                      target.dataset.fallbackStage = "1";
                      target.src = `/scene${scene.id}.jpg`;
                    } else if (stage === 1) {
                      target.dataset.fallbackStage = "2";
                      target.src = `/images/scene${scene.id}.jpg`;
                    } else {
                      // All URL paths exhausted: switch to rich SVG fallback
                      setImageErrors((prev) => ({ ...prev, [scene.id]: true }));
                    }
                  }}
                  className={`w-full h-full object-cover select-none transition-transform duration-700 ${
                    isActive && isPlaying ? scene.animationClass : "scale-100"
                  }`}
                />
              )}

              {/* Lighting Gradients & Cinematic Vignette */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/85 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40 pointer-events-none" />
            </div>
          );
        })}

        {/* Gentle Steam Particle Layer */}
        <SteamCanvas intensity={currentSceneIndex === 0 ? 1.0 : 0.6} isPlaying={isPlaying} />

        {/* Film Grain Texture */}
        <div className="film-grain pointer-events-none absolute inset-0 z-20 opacity-35" />

        {/* Play Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startPlayback();
                }}
                className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-25" />
                <Play className="w-8 h-8 fill-stone-950 ml-1 transition-transform group-hover:scale-110" />
              </button>
              <p className="text-sm font-semibold tracking-wide text-amber-200 drop-shadow">
                {currentTime >= totalDuration ? "Replay Video Story" : "Play Cinematic Video"}
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-900/80 px-3 py-1 rounded-full border border-stone-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Uninterrupted Natural Narration + Ambient Music
              </div>
            </div>
          </div>
        )}

        {/* Clear Subtitle Overlay - Unrushed, readable size */}
        {showSubtitles && (
          <div className="absolute bottom-16 inset-x-4 md:inset-x-12 z-30 pointer-events-none flex flex-col items-center text-center">
            <div className="max-w-3xl px-6 py-4 rounded-xl bg-black/80 backdrop-blur-md border border-stone-800/80 shadow-2xl transition-all">
              <p className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md leading-relaxed">
                "{currentScene.narrationText}"
              </p>
            </div>
          </div>
        )}

        {/* Scene Title Banner */}
        <div className="absolute top-4 inset-x-0 z-30 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700/60 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Act {currentScene.id}: {currentScene.title}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Engine Mixer Modal */}
      {showMixer && (
        <div className="absolute right-4 bottom-20 z-50 w-80 p-4 rounded-xl bg-stone-900/95 backdrop-blur-xl border border-stone-700 shadow-2xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Audio & Narration Settings
            </h4>
            <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
              {ttsStatus}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Narration Channel */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-400" /> English Narration (Gemini TTS)
                </span>
                <span className="text-stone-400">{Math.round(narrationVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={narrationVol}
                onChange={(e) => handleNarrationVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* BGM Channel */}
            <div>
              <div className="flex justify-between text-stone-300 mb-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Music className="w-3 h-3 text-cyan-400" /> Ambient Acoustic BGM
                </span>
                <span className="text-stone-400">{Math.round(bgmVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVol}
                onChange={(e) => handleBgmVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Voice Persona Selector */}
            <div className="pt-2 border-t border-stone-800">
              <label className="block text-stone-400 mb-1 font-medium">Narrator Voice:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "Kore", label: "Kore (Warm Female)" },
                  { id: "Puck", label: "Puck (Energetic Host)" },
                  { id: "Fenrir", label: "Fenrir (Rich Male)" },
                  { id: "Zephyr", label: "Zephyr (Smooth Calm)" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVoice(v.id);
                      fetchAllNarrationTts(v.id);
                    }}
                    className={`py-1.5 px-2 rounded text-[11px] font-medium transition text-left ${
                      selectedVoice === v.id
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-stone-800/60 text-stone-300 hover:bg-stone-800"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline & Player Controls */}
      <div className="p-4 bg-stone-950 border-t border-stone-800/80">
        <div className="relative mb-3 group">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold">{currentTime.toFixed(1)}s</span>
              <span className="text-stone-600">/</span>
              <span>{totalDuration.toFixed(1)}s</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase font-semibold">
              <button
                onClick={() => handleSeek(act1Start)}
                className={`transition ${currentSceneIndex === 0 ? "text-amber-400" : "text-stone-500 hover:text-stone-300"}`}
              >
                Act 1: Harmony
              </button>
              <button
                onClick={() => handleSeek(act2Start)}
                className={`transition ${currentSceneIndex === 1 ? "text-amber-400" : "text-stone-500 hover:text-stone-300"}`}
              >
                Act 2: Mix
              </button>
              <button
                onClick={() => handleSeek(act3Start)}
                className={`transition ${currentSceneIndex === 2 ? "text-amber-400" : "text-stone-500 hover:text-stone-300"}`}
              >
                Act 3: Welcome
              </button>
            </div>
          </div>

          {/* Progress Track */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              handleSeek(ratio * totalDuration);
            }}
            className="relative h-2.5 w-full bg-stone-800 rounded-full overflow-hidden cursor-pointer shadow-inner"
          >
            {/* Act Markers */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-stone-950 z-20"
              style={{ left: `${(act2Start / totalDuration) * 100}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-stone-950 z-20"
              style={{ left: `${(act3Start / totalDuration) * 100}%` }}
            />

            {/* Filled Progress */}
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-75 relative rounded-full"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md transform translate-x-1/2 scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition flex items-center justify-center cursor-pointer shadow-md"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-stone-950" /> : <Play className="w-5 h-5 fill-stone-950 ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 transition border border-stone-800 cursor-pointer"
              title="Restart from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleMuteToggle}
              className="p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 transition border border-stone-800 cursor-pointer"
              title="Toggle Audio Mute (M)"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <div className="hidden sm:flex items-center rounded-lg bg-stone-900 p-0.5 border border-stone-800 text-xs">
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-1 rounded-md font-mono text-[11px] transition ${
                    playbackRate === rate
                      ? "bg-amber-500 text-stone-950 font-bold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Quick Act Jump Buttons */}
          <div className="flex items-center gap-1.5">
            {[
              { time: act1Start, name: "Act 1: Harmony" },
              { time: act2Start, name: "Act 2: Mix" },
              { time: act3Start, name: "Act 3: Welcome" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleSeek(btn.time)}
                className={`px-3 py-1 text-xs rounded-md font-medium border transition ${
                  currentSceneIndex === i
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
                }`}
              >
                {btn.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
