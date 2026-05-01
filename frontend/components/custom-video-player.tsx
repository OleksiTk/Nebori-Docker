"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CustomVideoPlayerProps = {
  src: string;
  poster?: string;
  initialDuration?: string;
};

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const total = Math.floor(value);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d="M4 2.8v10.4c0 .6.7 1 1.2.7l8.1-5.2a.8.8 0 0 0 0-1.4L5.2 2.1A.8.8 0 0 0 4 2.8z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
      <rect x="9" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 6.3h2.3l2.8-2.4c.5-.4 1.2 0 1.2.6v7c0 .6-.7 1-1.2.6L4.8 9.7H2.5z" fill="currentColor" />
      <path d="m10.4 6.2 3.1 3.1m0-3.1-3.1 3.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 6.3h2.3l2.8-2.4c.5-.4 1.2 0 1.2.6v7c0 .6-.7 1-1.2.6L4.8 9.7H2.5z" fill="currentColor" />
      <path d="M11 6.1c.7.6.7 3.2 0 3.8m1.7-5.2c1.2 1.2 1.2 5.4 0 6.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-cog-icon lucide-cog h-4 w-4"
      aria-hidden="true"
    >
      <path d="M11 10.27 7 3.34" />
      <path d="m11 13.73-4 6.93" />
      <path d="M12 22v-2" />
      <path d="M12 2v2" />
      <path d="M14 12h8" />
      <path d="m17 20.66-1-1.73" />
      <path d="m17 3.34-1 1.73" />
      <path d="M2 12h2" />
      <path d="m20.66 17-1.73-1" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <rect x="2.2" y="3" width="1.5" height="10" fill="currentColor" />
      <path d="M13 3.4v9.2c0 .5-.6.9-1.1.6L5.1 8.6a.7.7 0 0 1 0-1.2l6.8-4.6c.5-.3 1.1 0 1.1.6z" fill="currentColor" />
    </svg>
  );
}

function parseDurationToSeconds(value?: string) {
  if (!value) return 0;
  const parts = value.split(":").map((v) => Number(v));
  if (parts.length === 2 && parts.every((v) => Number.isFinite(v))) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && parts.every((v) => Number.isFinite(v))) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

export function CustomVideoPlayer({ src, poster, initialDuration }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const seekTrackRef = useRef<HTMLDivElement | null>(null);
  const scrubbingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(parseDurationToSeconds(initialDuration));
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("1080p");
  const [loop, setLoop] = useState(false);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => {
      const nextDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : parseDurationToSeconds(initialDuration);
      setDuration(nextDuration || 0);
      if (nextDuration > 0) {
        setSeekValue((video.currentTime / nextDuration) * 100);
      }
    };
    const onDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };
    const onTime = () => {
      const time = video.currentTime || 0;
      setCurrentTime(time);
      if (!scrubbingRef.current) {
        if (!video.duration) setSeekValue(0);
        else setSeekValue((time / video.duration) * 100);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => {
      setMuted(video.muted);
      setVolume(video.volume);
    };
    const onSeeked = () => {
      if (scrubbingRef.current) {
        scrubbingRef.current = false;
        setSeeking(false);
      }
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolume);
    video.addEventListener("seeked", onSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolume);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [initialDuration]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const onSeek = (value: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    video.currentTime = (value / 100) * duration;
    setCurrentTime(video.currentTime);
    setSeekValue(value);
  };

  const seekFromClientX = (clientX: number) => {
    const track = seekTrackRef.current;
    const video = videoRef.current;
    if (!track || !video || !duration) return;
    const rect = track.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, raw));
    setSeekValue(clamped);
    const realDuration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : duration;
    if (!realDuration) return;
    const nextTime = (clamped / 100) * realDuration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  useEffect(() => {
    if (!seeking) return;
    const onMove = (e: PointerEvent) => {
      seekFromClientX(e.clientX);
    };
    const onUp = (e: PointerEvent) => {
      seekFromClientX(e.clientX);
      scrubbingRef.current = false;
      setSeeking(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [seeking, duration]);

  const onVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = value;
    setVolume(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!document.fullscreenElement) {
      await wrap.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const applyPlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const applyLoop = (next: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = next;
    setLoop(next);
  };

  return (
    <div ref={wrapRef} className="relative aspect-video overflow-hidden rounded-[4px] border border-[rgba(255,255,255,0.14)] bg-black">
      <video ref={videoRef} className="h-full w-full object-contain bg-black" src={src} poster={poster} preload="metadata" onClick={togglePlay} />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent px-2 pb-2 pt-10">
        <div className="pointer-events-auto relative">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-[2px] border border-[rgba(255,255,255,0.2)] bg-[linear-gradient(180deg,#2a303d_0%,#1b202a_100%)] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onSeek(Math.max(0, progress - 5))} className="rounded-[2px] border border-[rgba(255,255,255,0.22)] bg-[#212733] p-1 text-[#d6dde9] hover:border-[rgba(245,197,24,0.5)]" aria-label="Назад 5 секунд">
                <StepBackIcon />
              </button>
              <button type="button" onClick={togglePlay} className="rounded-[2px] border border-[rgba(255,255,255,0.22)] bg-[#212733] p-1 text-[#d6dde9] hover:border-[rgba(245,197,24,0.5)]" aria-label={playing ? "Пауза" : "Відтворити"}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <div
                ref={seekTrackRef}
                role="slider"
                aria-label="Перемотка"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(seeking ? seekValue : progress)}
                tabIndex={0}
                onPointerDown={(e) => {
                  scrubbingRef.current = true;
                  setSeeking(true);
                  seekFromClientX(e.clientX);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") onSeek(Math.max(0, progress - 1));
                  if (e.key === "ArrowRight") onSeek(Math.min(100, progress + 1));
                }}
                className="relative h-1.5 min-w-0 flex-1 cursor-pointer bg-[rgba(255,255,255,0.24)]"
              >
                <div className="absolute inset-y-0 left-0 bg-[#f5c518]" style={{ width: `${seeking ? seekValue : progress}%` }} />
                <div
                  className="absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 border border-black/70 bg-[#f5c518]"
                  style={{ left: `calc(${seeking ? seekValue : progress}% - 5px)` }}
                />
              </div>
              <span className="shrink-0 rounded-[2px] border border-[rgba(255,255,255,0.2)] bg-black px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[#f0f2f7]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button type="button" onClick={toggleMute} className="rounded-[2px] border border-[rgba(255,255,255,0.22)] bg-[#212733] p-1 text-[#d6dde9] hover:border-[rgba(245,197,24,0.5)]" aria-label={muted ? "Увімкнути звук" : "Вимкнути звук"}>
                <VolumeIcon muted={muted || volume === 0} />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                style={{ ["--progress" as any]: `${(muted ? 0 : volume) * 100}%` }}
                className="range-square h-1.5 w-14 cursor-pointer"
                aria-label="Гучність"
              />
              <button
                type="button"
                onClick={() => setSettingsOpen((v) => !v)}
                className="rounded-[2px] border border-[rgba(255,255,255,0.22)] bg-[#212733] p-1 text-[#d6dde9] hover:border-[rgba(245,197,24,0.5)]"
                aria-label="Налаштування"
              >
                <GearIcon />
              </button>
              <button type="button" onClick={toggleFullscreen} className="rounded-[2px] border border-[rgba(255,255,255,0.22)] bg-[#212733] p-1 text-[#d6dde9] hover:border-[rgba(245,197,24,0.5)]" aria-label="Повний екран">
                <FullscreenIcon />
              </button>
            </div>
          </div>

          {settingsOpen && (
            <div className="absolute bottom-11 right-0 w-44 rounded-[2px] border border-[rgba(255,255,255,0.18)] bg-[rgba(10,12,18,0.96)] p-2 text-xs text-white">
              <div className="mb-1 font-semibold text-[#d6dbe8]">Налаштування</div>
              <div className="mb-1 text-[#9ba6bd]">Швидкість</div>
              <div className="mb-2 flex flex-wrap gap-1">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => applyPlaybackRate(rate)}
                    className={`rounded-[2px] border px-1.5 py-1 ${
                      playbackRate === rate ? "border-[#f5c518] text-[#f5c518]" : "border-[rgba(255,255,255,0.2)] text-[#d0d7e7]"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
              <div className="mb-1 text-[#9ba6bd]">Якість</div>
              <div className="mb-2 flex gap-1">
                {["1080p", "720p", "480p"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    className={`rounded-[2px] border px-1.5 py-1 ${
                      quality === q ? "border-[#f5c518] text-[#f5c518]" : "border-[rgba(255,255,255,0.2)] text-[#d0d7e7]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => applyLoop(!loop)}
                className={`w-full rounded-[2px] border px-1.5 py-1 text-left ${
                  loop ? "border-[#f5c518] text-[#f5c518]" : "border-[rgba(255,255,255,0.2)] text-[#d0d7e7]"
                }`}
              >
                Loop: {loop ? "On" : "Off"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
