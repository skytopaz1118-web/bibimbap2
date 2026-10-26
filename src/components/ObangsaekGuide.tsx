import React from "react";
import { BIBIMBAP_INGREDIENTS } from "../data/videoData";
import { Sparkles, HeartPulse, Palette } from "lucide-react";

export const ObangsaekGuide: React.FC = () => {
  return (
    <div className="rounded-2xl bg-stone-900/60 border border-stone-800 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Palette className="w-4 h-4 text-amber-400" />
            Culinary Wisdom
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-stone-100">
            Why Bibimbap is a "Bowl of Colorful Harmony"
          </h3>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            In traditional gastronomy, food serves as restorative nourishment. Bibimbap is structured around{" "}
            <span className="text-amber-300 font-semibold">The Five Cardinal Colors</span> — representing natural elemental balance and comprehensive dietary wellness.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-950/80 px-4 py-2 rounded-xl border border-stone-800 text-xs text-stone-300 self-start md:self-auto">
          <HeartPulse className="w-4 h-4 text-rose-400" />
          <span>Complete 5-Color Nutritional Balance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BIBIMBAP_INGREDIENTS.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-stone-950/70 border border-stone-800/80 p-4 hover:border-amber-500/40 transition group"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${item.color} shadow-sm`} />
              <div>
                <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-200 transition">
                  {item.name}
                </h4>
                <p className="text-[11px] text-amber-400/90">{item.category}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-stone-400">
                <span className="text-stone-500 font-medium">Element: </span>
                {item.symbolism}
              </div>
              <div className="text-stone-400">
                <span className="text-stone-500 font-medium">Flavor Profile: </span>
                {item.flavor}
              </div>
              <div className="text-stone-400 pt-1 border-t border-stone-900 text-[11px] text-emerald-400/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                {item.nutrition}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
