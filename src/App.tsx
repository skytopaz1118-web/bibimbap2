/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileText,
  Globe2,
  Flame,
  Award,
  UtensilsCrossed,
} from "lucide-react";
import { CinematicVideoPlayer } from "./components/CinematicVideoPlayer";
import { SceneTimelineCard } from "./components/SceneTimelineCard";
import { ObangsaekGuide } from "./components/ObangsaekGuide";
import { HowToEatGuide } from "./components/HowToEatGuide";
import { StoryExportModal } from "./components/StoryExportModal";
import { BIBIMBAP_SCENES, SceneData } from "./data/videoData";

export default function App() {
  const [currentScene, setCurrentScene] = useState<SceneData>(BIBIMBAP_SCENES[0]);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const handleSelectScene = (scene: SceneData) => {
    setCurrentScene(scene);
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden">
      {/* Ambient Dynamic Backdrop & Cinema Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src={currentScene.imageSrc}
          alt=""
          aria-hidden="true"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.tried) {
              target.dataset.tried = "true";
              target.src = `/scene${currentScene.id}.jpg`;
            }
          }}
          className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-25 saturate-150 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-stone-950/70 to-stone-950" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-600/10 via-transparent to-transparent" />
      </div>

      {/* Top Global Navigation Bar */}
      <header className="relative z-40 sticky top-0 bg-stone-950/85 backdrop-blur-xl border-b border-stone-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinema text-base sm:text-lg font-bold tracking-wider text-amber-100">
                  TASTE OF KOREA
                </span>
                <span className="text-[11px] text-amber-400 font-semibold tracking-wide uppercase hidden sm:inline">
                  Bibimbap Showcase
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                4K Food Commercial for Global Travelers & Food Enthusiasts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Production Script</span>
              <span className="sm:hidden">Script</span>
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Target: Global Travelers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-12">
        {/* Hero Title Section */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-xs text-amber-300 font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            4K High-End Food Film · Unclipped English Narration Synced
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-stone-100 font-cinema">
            Bibimbap: A Bowl of Colorful Harmony
          </h1>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed font-light">
            Steaming earthenware bowl, vibrant fresh vegetables, velvety golden yolk, and savory Gochujang red chili paste — experience the culinary rhythm of Korea's signature comfort food.
          </p>
        </div>

        {/* Video Player */}
        <section className="space-y-3">
          <CinematicVideoPlayer onSceneChange={handleSelectScene} />
          <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 px-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Full Uncut Audio Narration · Scene Length Paced to Speech</span>
            </div>
            <div className="text-stone-500">
              Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">Space</kbd> Play/Pause &nbsp;
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">1</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">2</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300">3</kbd> Jump Acts
            </div>
          </div>
        </section>

        {/* 3-Act Shot Breakdown Card */}
        <section>
          <SceneTimelineCard
            currentScene={currentScene}
            onSelectScene={handleSelectScene}
          />
        </section>

        {/* Sensory Highlights Banner */}
        <section className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-rose-950/30 border border-amber-900/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Commercial Visual & Voice Design
            </span>
            <h3 className="text-xl font-bold text-stone-100">
              Tailored for International Travelers & Food Lovers
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Every shot is calibrated for international appeal: the gentle curling steam at the start, the irresistible yolk break and rhythmic red gochujang mix, and the welcoming hero spoonful inviting travelers to experience Korean hospitality.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0">
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
              <div className="text-lg font-bold text-amber-400 font-mono">Act 1</div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">Harmony</div>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
              <div className="text-lg font-bold text-rose-400 font-mono">Act 2</div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">Mix & Spice</div>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 text-center">
              <div className="text-lg font-bold text-emerald-400 font-mono">Act 3</div>
              <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">Welcome</div>
            </div>
          </div>
        </section>

        {/* Cultural Wisdom: Five Colors Guide */}
        <section>
          <ObangsaekGuide />
        </section>

        {/* Dining Etiquette Guide */}
        <section>
          <HowToEatGuide />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-stone-950 border-t border-stone-800/80 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-cinema">
            <span>TASTE OF KOREA</span>
            <span className="text-stone-600">•</span>
            <span>A CULINARY HARMONY</span>
            <span className="text-stone-600">•</span>
            <span>SEOUL & JEONJU</span>
          </div>
          <p className="text-xs text-stone-500 font-light max-w-lg mx-auto">
            "Enjoy a healthy, delicious meal! Welcome to Korea!" — Cinematic Video Showcase produced with synchronized AI audio narration and gentle ambient music.
          </p>
        </div>
      </footer>

      {/* Production Script Modal */}
      <StoryExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
