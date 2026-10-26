import React, { useState } from "react";
import { BIBIMBAP_SCENES, SceneData } from "../data/videoData";
import { Play, Camera, Volume2 } from "lucide-react";
import { audioEngine } from "../services/audioEngine";
import { BibimbapIllustrationFallback } from "./BibimbapIllustrationFallback";

interface SceneTimelineCardProps {
  currentScene: SceneData;
  onSelectScene: (scene: SceneData) => void;
}

export const SceneTimelineCard: React.FC<SceneTimelineCardProps> = ({
  currentScene,
  onSelectScene,
}) => {
  const [cardErrors, setCardErrors] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-400" />
            Cinematic Shot Breakdown
          </h3>
          <p className="text-xs text-stone-400">
            Click any act to audition the narration line and inspect camera direction
          </p>
        </div>
        <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          3 Acts · Continuous Flow
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BIBIMBAP_SCENES.map((scene) => {
          const isSelected = currentScene.id === scene.id;
          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(scene)}
              className={`group relative rounded-xl overflow-hidden border p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-stone-900 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30"
                  : "bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900"
              }`}
            >
              <div>
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 border border-stone-800">
                  {cardErrors[scene.id] ? (
                    <BibimbapIllustrationFallback sceneId={scene.id} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={scene.imageSrc}
                      alt={scene.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const stage = Number(target.dataset.stage || "0");
                        if (stage === 0) {
                          target.dataset.stage = "1";
                          target.src = `/scene${scene.id}.jpg`;
                        } else if (stage === 1) {
                          target.dataset.stage = "2";
                          target.src = `/images/scene${scene.id}.jpg`;
                        } else {
                          setCardErrors((prev: Record<number, boolean>) => ({ ...prev, [scene.id]: true }));
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
                    Act {scene.id}
                  </div>
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-200 transition">
                    {scene.title}
                  </h4>
                </div>

                <p className="text-[11px] text-stone-300 italic mb-2 leading-relaxed">
                  "{scene.narrationText}"
                </p>

                <div className="text-[10px] text-stone-400 bg-stone-950/80 p-2 rounded border border-stone-800/80 mb-2">
                  <span className="text-amber-400 font-medium">Camera: </span>
                  {scene.cameraMovement}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.playNarration(scene);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 transition"
                  title="Audition Narration"
                >
                  <Volume2 className="w-3 h-3" /> Audition Line
                </button>
                <span className="text-[10px] text-stone-500">Unclipped</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
