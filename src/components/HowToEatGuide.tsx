import React from "react";
import { Utensils, Sparkles, Check } from "lucide-react";

export const HowToEatGuide: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Pop the Golden Yolk",
      desc: "Use your traditional silver spoon to gently pierce the centered yolk. Allow the rich, velvety golden warmth to melt down into the steamed rice.",
      tip: "The yolk creates a silky emulsified sauce that coats each rice grain.",
    },
    {
      step: 2,
      title: "Add Gochujang & Sesame Oil",
      desc: "Spoon in the fermented red chili paste. Drizzle aromatic toasted sesame oil for an intoxicating nutty fragrance.",
      tip: "Adjust spice level to taste: 1 spoonful for mild warmth, 2 for authentic kick!",
    },
    {
      step: 3,
      title: "Mix Rhythmically with a Spoon",
      desc: "Hold your spoon firmly and mix in vigorous circular motions from bottom to top. Always use a spoon rather than chopsticks to distribute the sauce evenly.",
      tip: "Mix thoroughly until every grain of rice turns a radiant ruby red.",
    },
    {
      step: 4,
      title: "Savor the Scorched Rice Crust",
      desc: "For hot stone pot bibimbap, press a layer of rice against the hot earthenware walls to form an irresistible golden, nutty, crispy rice crust.",
      tip: "Scrape the crunchy toasted crust with your spoon for the ultimate savory finale!",
    },
  ];

  return (
    <div className="rounded-2xl bg-stone-900/60 border border-stone-800 p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
            <Utensils className="w-4 h-4 text-rose-400" />
            Dining Guide
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-stone-100">
            How to Enjoy Bibimbap Like a Local
          </h3>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            A beginner-friendly etiquette guide for travelers. Follow these 4 authentic steps to experience peak flavor, aroma, and texture.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Pro-Tip: Always use a spoon to mix, not chopsticks!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s) => (
          <div
            key={s.step}
            className="relative rounded-xl bg-stone-950/70 border border-stone-800 p-5 flex flex-col justify-between hover:border-amber-500/30 transition group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  {s.step}
                </span>
                <span className="text-[11px] text-stone-500">Step {s.step}</span>
              </div>

              <h4 className="text-sm font-bold text-stone-100 mb-2 group-hover:text-amber-200 transition">
                {s.title}
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                {s.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-900 text-[11px] text-amber-400/90 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
              <span className="font-semibold text-amber-300">Key: </span>
              {s.tip}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
