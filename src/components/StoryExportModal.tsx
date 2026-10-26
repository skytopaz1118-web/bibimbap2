import React, { useState } from "react";
import { Copy, Check, Download, X, Film } from "lucide-react";

interface StoryExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryExportModal: React.FC<StoryExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const scriptText = `==================================================
TASTE OF KOREA - CINEMATIC COMMERCIAL SCRIPT
Target Audience: International Foodies & Global Travelers
Style: 4K High-End Cinematic Food Film, Warm Golden Lighting
Audio Narration: Synced English Voiceover + Ambient Acoustic Score
==================================================

[ACT 1] THE COLORFUL HARMONY
- Camera: Slow, cinematic 4K macro zoom-in over rising aromatic steam.
- Visual: Steaming stone bowl with vibrant green zucchini, julienned carrots, sautéed spinach, mushrooms, soybean sprouts, gochujang dollop, and pristine glowing golden egg yolk centered.
- Audio Narration: "Bibimbap isn't just a rice bowl, it's a bowl of colorful harmony!"
- Sound Effects: Gentle acoustic pentatonic melody with ambient warmth.

[ACT 2] THE SAVORY MIX
- Camera: Dynamic close-up tracking shot.
- Visual: Silver spoon pops the velvety egg yolk, oozing over white rice, rhythmically mixing with savory red Gochujang chili paste into glossy red harmony.
- Audio Narration: "Add savory Gochujang red pepper paste to fresh vegetables and mix it all together."
- Sound Effects: Smooth dynamic audio transition with rhythmic musical flow.

[ACT 3] TASTE OF KOREA
- Camera: Hero macro lift towards camera lens with warm restaurant bokeh background.
- Visual: Glistening spoonful heaped with gochujang-coated rice, tender beef, vegetables, toasted sesame seeds, and delicate rising steam.
- Audio Narration: "Enjoy a healthy, delicious meal! Welcome to Korea!"
- Sound Effects: Uplifting resolution and welcoming hospitality chord.
==================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bibimbap_Cinematic_Script.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl p-6 text-stone-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-stone-100">
                Commercial Script & Shot Breakdown
              </h3>
              <p className="text-xs text-stone-400">
                Full production cues, camera movements, and audio script in English
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Content Area */}
        <div className="my-4 flex-1 overflow-y-auto rounded-xl bg-stone-950 p-4 border border-stone-800/80 font-mono text-xs text-stone-300 leading-relaxed whitespace-pre-wrap select-all">
          {scriptText}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800">
          <span className="text-xs text-stone-400">
            Formatted for video creators, voice artists, and travel campaigns.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Script"}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md"
            >
              <Download className="w-4 h-4" />
              Download .TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
