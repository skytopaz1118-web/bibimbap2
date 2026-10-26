/**
 * Cinematic Audio Engine for Bibimbap Video
 * Web Audio API gentle Korean pentatonic ambient BGM,
 * and Gemini 3.8 Flash Lite TTS natural voiceover with complete clip duration tracking.
 * (Sizzle sound removed as requested)
 */

export interface NarrationSegment {
  id: number;
  timeRange: string;
  startTime: number;
  endTime: number;
  duration?: number;
  title: string;
  text?: string;
  narrationText?: string;
  voice?: string;
  style?: string;
  audioBlobUrl?: string;
}

class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmInterval: number | null = null;
  private bgmGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Volume settings (0 - 1)
  public bgmVolume = 0.3;
  public narrationVolume = 1.0;
  public isMuted = false;

  // Active audio elements for narration
  private currentNarrationAudio: HTMLAudioElement | null = null;
  private audioBlobs: Map<number, string> = new Map();
  private audioDurations: Map<number, number> = new Map();
  private isInitialized = false;

  public init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API initialization failed:", e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1.0, this.ctx.currentTime);
    }
    if (this.currentNarrationAudio) {
      this.currentNarrationAudio.muted = muted;
    }
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public setNarrationVolume(val: number) {
    this.narrationVolume = Math.max(0, Math.min(1, val));
    if (this.currentNarrationAudio) {
      this.currentNarrationAudio.volume = this.narrationVolume;
    }
  }

  /**
   * Generates warm, modern acoustic pentatonic melody
   */
  public startAmbientBgm() {
    this.init();
    this.resume();
    if (!this.ctx || this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    const ctx = this.ctx;
    const bgmGain = this.bgmGain;
    if (!bgmGain) return;

    // Pentatonic scale notes (G, A, C, D, E) frequencies across 2 octaves
    const notes = [
      196.00, // G3
      220.00, // A3
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
    ];

    let step = 0;
    const melodyPattern = [2, 4, 5, 4, 7, 5, 4, 3, 2, 1, 3, 2, 0, 2, 4, 3];

    const playPluck = (freq: number, duration: number, delay = 0) => {
      if (!this.isBgmPlaying || !this.ctx) return;
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, ctx.currentTime + delay);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + delay + duration);

        noteGain.gain.setValueAtTime(0.001, ctx.currentTime + delay);
        noteGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + delay + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(bgmGain);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      } catch (e) {}
    };

    const playDrone = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      try {
        const droneOsc = ctx.createOscillator();
        const droneGain = ctx.createGain();
        droneOsc.type = "sine";
        droneOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
        droneGain.gain.setValueAtTime(0.06, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

        droneOsc.connect(droneGain);
        droneGain.connect(bgmGain);
        droneOsc.start();
        droneOsc.stop(ctx.currentTime + 4.0);
      } catch (e) {}
    };

    playDrone();
    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying) return;
      const noteIdx = melodyPattern[step % melodyPattern.length];
      const freq = notes[noteIdx] || 261.63;
      playPluck(freq, 0.7);

      if (step % 4 === 0) {
        playPluck(notes[0], 1.2, 0);
      }
      if (step % 8 === 0) {
        playDrone();
      }
      step++;
    }, 450);
  }

  public stopAmbientBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  /**
   * Duck BGM volume temporarily when narration speaks
   */
  public duckBgm(duck: boolean) {
    if (!this.bgmGain || !this.ctx) return;
    const target = duck ? this.bgmVolume * 0.2 : this.bgmVolume;
    this.bgmGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
  }

  /**
   * Store fetched base64 audio and measure its duration
   */
  public cacheAudio(segmentId: number, base64OrBlobUrl: string, callback?: (duration: number) => void) {
    const url = base64OrBlobUrl.startsWith("data:") || base64OrBlobUrl.startsWith("blob:")
      ? base64OrBlobUrl
      : `data:audio/wav;base64,${base64OrBlobUrl}`;

    this.audioBlobs.set(segmentId, url);

    // Pre-measure duration
    try {
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          this.audioDurations.set(segmentId, audio.duration);
          if (callback) callback(audio.duration);
        }
      };
    } catch (e) {}
  }

  public getCachedAudioUrl(segmentId: number): string | undefined {
    return this.audioBlobs.get(segmentId);
  }

  public getAudioDuration(segmentId: number): number | undefined {
    return this.audioDurations.get(segmentId);
  }

  /**
   * Play narration audio and guarantee onEnd is called when finished
   */
  public playNarration(segment: NarrationSegment, onEnd?: () => void) {
    this.stopNarration();
    this.duckBgm(true);
    const speechText = segment.text || segment.narrationText || "";

    const cachedUrl = this.audioBlobs.get(segment.id) || segment.audioBlobUrl;
    if (cachedUrl) {
      try {
        const audio = new Audio(cachedUrl);
        audio.volume = this.narrationVolume;
        audio.muted = this.isMuted;
        this.currentNarrationAudio = audio;

        audio.onloadedmetadata = () => {
          if (audio.duration) {
            this.audioDurations.set(segment.id, audio.duration);
          }
        };

        audio.onended = () => {
          this.duckBgm(false);
          this.currentNarrationAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.fallbackSpeechSynthesis(speechText, onEnd);
        };

        audio.play().catch(() => {
          this.fallbackSpeechSynthesis(speechText, onEnd);
        });
        return;
      } catch (err) {
        console.warn("Audio element playback failed, using fallback:", err);
      }
    }

    this.fallbackSpeechSynthesis(speechText, onEnd);
  }

  private fallbackSpeechSynthesis(text: string, onEnd?: () => void) {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.95; // Natural clear pace
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
        );
        if (enVoice) {
          utterance.voice = enVoice;
        }

        utterance.onend = () => {
          this.duckBgm(false);
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.duckBgm(false);
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        this.duckBgm(false);
        if (onEnd) onEnd();
      }
    } else {
      this.duckBgm(false);
      if (onEnd) onEnd();
    }
  }

  public stopNarration() {
    if (this.currentNarrationAudio) {
      this.currentNarrationAudio.pause();
      this.currentNarrationAudio.currentTime = 0;
      this.currentNarrationAudio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.duckBgm(false);
  }

  public stopAll() {
    this.stopNarration();
    this.stopAmbientBgm();
  }
}

export const audioEngine = new CinematicAudioEngine();
