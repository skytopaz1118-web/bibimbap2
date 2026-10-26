import React from "react";

interface FallbackProps {
  sceneId: number;
  className?: string;
}

export const BibimbapIllustrationFallback: React.FC<FallbackProps> = ({ sceneId, className = "" }) => {
  if (sceneId === 1) {
    // Act 1: Perfectly arranged steaming stone bowl
    return (
      <div className={`relative w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 flex items-center justify-center overflow-hidden ${className}`}>
        {/* Soft Ambient Glow */}
        <div className="absolute w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute w-64 h-64 rounded-full bg-rose-600/10 blur-2xl translate-x-20" />

        <svg viewBox="0 0 800 450" className="w-full h-full max-h-full object-contain filter drop-shadow-2xl">
          <defs>
            <radialGradient id="bowlGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2c2826" />
              <stop offset="85%" stopColor="#1a1816" />
              <stop offset="100%" stopColor="#0d0c0b" />
            </radialGradient>
            <radialGradient id="yolkGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="30%" stopColor="#fdb813" />
              <stop offset="80%" stopColor="#f39c12" />
              <stop offset="100%" stopColor="#d35400" />
            </radialGradient>
            <linearGradient id="gochujangGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e74c3c" />
              <stop offset="70%" stopColor="#c0392b" />
              <stop offset="100%" stopColor="#800000" />
            </linearGradient>
            <linearGradient id="zucchiniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="100%" stopColor="#27ae60" />
            </linearGradient>
            <linearGradient id="carrotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e67e22" />
              <stop offset="100%" stopColor="#d35400" />
            </linearGradient>
            <linearGradient id="spinachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e824c" />
              <stop offset="100%" stopColor="#145a32" />
            </linearGradient>
            <linearGradient id="mushroomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#795548" />
              <stop offset="100%" stopColor="#3e2723" />
            </linearGradient>
          </defs>

          {/* Wooden Tray */}
          <ellipse cx="400" cy="360" rx="320" ry="60" fill="#2b1d14" opacity="0.6" />
          
          {/* Stone Bowl Base */}
          <ellipse cx="400" cy="270" rx="230" ry="140" fill="url(#bowlGrad)" stroke="#4a3e3d" strokeWidth="8" />
          <ellipse cx="400" cy="235" rx="205" ry="110" fill="#fffdfa" />

          {/* Rice Base Texture */}
          <ellipse cx="400" cy="235" rx="200" ry="105" fill="#fdfbf7" />

          {/* Slices: Zucchini (Green) */}
          <path d="M 400 235 L 300 150 A 200 105 0 0 1 400 130 Z" fill="url(#zucchiniGrad)" opacity="0.95" />
          {/* Slices: Carrots (Orange) */}
          <path d="M 400 235 L 400 130 A 200 105 0 0 1 500 155 Z" fill="url(#carrotGrad)" opacity="0.95" />
          {/* Slices: Mushrooms (Brown) */}
          <path d="M 400 235 L 500 155 A 200 105 0 0 1 590 230 Z" fill="url(#mushroomGrad)" opacity="0.95" />
          {/* Slices: Gochujang (Deep Red) */}
          <path d="M 400 235 L 590 230 A 200 105 0 0 1 480 320 Z" fill="url(#gochujangGrad)" opacity="0.95" />
          {/* Slices: Bean Sprouts & Beef */}
          <path d="M 400 235 L 480 320 A 200 105 0 0 1 320 325 Z" fill="#e0cda9" opacity="0.95" />
          {/* Slices: Spinach (Dark Green) */}
          <path d="M 400 235 L 320 325 A 200 105 0 0 1 210 240 Z" fill="url(#spinachGrad)" opacity="0.95" />
          <path d="M 400 235 L 210 240 A 200 105 0 0 1 300 150 Z" fill="#8d6e63" opacity="0.95" />

          {/* Center Golden Yolk */}
          <ellipse cx="400" cy="235" rx="42" ry="36" fill="url(#yolkGrad)" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.4))" />
          <ellipse cx="388" cy="225" rx="12" ry="7" fill="#ffffff" opacity="0.65" />

          {/* Sesame Seed Accents */}
          <ellipse cx="380" cy="260" rx="3" ry="1.5" fill="#fdfbf7" transform="rotate(25 380 260)" />
          <ellipse cx="420" cy="255" rx="3" ry="1.5" fill="#fdfbf7" transform="rotate(-30 420 255)" />
          <ellipse cx="400" cy="285" rx="3" ry="1.5" fill="#fdfbf7" transform="rotate(10 400 285)" />
          <ellipse cx="435" cy="225" rx="3" ry="1.5" fill="#fdfbf7" transform="rotate(45 435 225)" />
        </svg>
      </div>
    );
  }

  if (sceneId === 2) {
    // Act 2: Dynamic yolk breakage and rhythmic mixing
    return (
      <div className={`relative w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute w-96 h-96 rounded-full bg-rose-600/20 blur-3xl" />
        <div className="absolute w-80 h-80 rounded-full bg-amber-500/20 blur-3xl -translate-y-10" />

        <svg viewBox="0 0 800 450" className="w-full h-full max-h-full object-contain filter drop-shadow-2xl">
          <defs>
            <radialGradient id="mixBowl" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3d2c29" />
              <stop offset="100%" stopColor="#140f0e" />
            </radialGradient>
            <linearGradient id="mixRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff416c" />
              <stop offset="50%" stopColor="#c0392b" />
              <stop offset="100%" stopColor="#7a1208" />
            </linearGradient>
            <linearGradient id="silverSpoon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#bdc3c7" />
              <stop offset="100%" stopColor="#7f8c8d" />
            </linearGradient>
          </defs>

          {/* Stone Bowl Base */}
          <ellipse cx="400" cy="260" rx="250" ry="150" fill="url(#mixBowl)" stroke="#4a3e3d" strokeWidth="8" />
          
          {/* Swirling Mix Motion Graphic */}
          <path
            d="M 230 240 Q 350 160 520 200 T 560 300 T 320 330 T 260 250"
            fill="none"
            stroke="url(#mixRed)"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 280 220 Q 420 180 500 240 T 380 310"
            fill="none"
            stroke="#f39c12"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 320 200 Q 450 210 460 270 T 340 280"
            fill="none"
            stroke="#27ae60"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Bursting Golden Yolk Flow */}
          <ellipse cx="370" cy="210" rx="30" ry="24" fill="#f39c12" />
          <path d="M 370 225 Q 390 270 420 280 Q 400 295 380 270 Z" fill="#f1c40f" />
          <ellipse cx="362" cy="202" rx="8" ry="4" fill="#ffffff" opacity="0.7" />

          {/* Korean Metal Spoon Dipping In */}
          <g transform="rotate(-35 480 160)">
            <rect x="475" y="40" width="12" height="180" rx="6" fill="url(#silverSpoon)" />
            <ellipse cx="481" cy="225" rx="32" ry="44" fill="url(#silverSpoon)" stroke="#95a5a6" strokeWidth="2" />
            <ellipse cx="481" cy="225" rx="20" ry="30" fill="#f39c12" opacity="0.75" />
          </g>
        </svg>
      </div>
    );
  }

  // Act 3: Glistening Spoonful Lift
  return (
    <div className={`relative w-full h-full bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute w-96 h-96 rounded-full bg-rose-600/15 blur-3xl translate-x-24" />

      <svg viewBox="0 0 800 450" className="w-full h-full max-h-full object-contain filter drop-shadow-2xl">
        <defs>
          <linearGradient id="heroRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e74c3c" />
            <stop offset="60%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#962d22" />
          </linearGradient>
          <linearGradient id="heroSpoon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#d5dbdb" />
            <stop offset="100%" stopColor="#95a5a6" />
          </linearGradient>
        </defs>

        {/* Soft Bokeh Korean Restaurant Background */}
        <circle cx="200" cy="120" r="40" fill="#f39c12" opacity="0.12" />
        <circle cx="650" cy="160" r="55" fill="#e67e22" opacity="0.1" />
        <circle cx="150" cy="320" r="50" fill="#e74c3c" opacity="0.08" />

        {/* Blurred Stone Bowl in Background */}
        <ellipse cx="400" cy="350" rx="260" ry="80" fill="#1c1917" opacity="0.7" filter="blur(6px)" />

        {/* Spoon Handle extending from right */}
        <path d="M 750 360 L 460 240" stroke="url(#heroSpoon)" strokeWidth="18" strokeLinecap="round" />

        {/* Spoon Bowl Loaded With Heaped Bibimbap */}
        <ellipse cx="420" cy="225" rx="95" ry="65" fill="url(#heroSpoon)" stroke="#7f8c8d" strokeWidth="4" />

        {/* Glossy Red Coated Rice Cluster */}
        <ellipse cx="410" cy="205" rx="85" ry="55" fill="url(#heroRed)" />
        <ellipse cx="430" cy="180" rx="65" ry="45" fill="#d35400" />
        
        {/* Colorful Veggie Strands clinging to spoon */}
        <path d="M 370 170 Q 340 220 330 260" stroke="#27ae60" strokeWidth="6" strokeLinecap="round" />
        <path d="M 450 170 Q 480 230 490 270" stroke="#e67e22" strokeWidth="7" strokeLinecap="round" />
        <path d="M 400 190 Q 380 250 375 285" stroke="#3e2723" strokeWidth="6" strokeLinecap="round" />
        <path d="M 430 195 Q 440 260 455 295" stroke="#f1c40f" strokeWidth="6" strokeLinecap="round" />

        {/* Sesame Seeds Glistening */}
        <ellipse cx="405" cy="175" rx="4" ry="2" fill="#fff" transform="rotate(30 405 175)" />
        <ellipse cx="435" cy="165" rx="4" ry="2" fill="#fff" transform="rotate(-20 435 165)" />
        <ellipse cx="420" cy="190" rx="4" ry="2" fill="#fff" transform="rotate(45 420 190)" />
        <ellipse cx="380" cy="195" rx="4" ry="2" fill="#fff" transform="rotate(-15 380 195)" />
        <ellipse cx="450" cy="195" rx="4" ry="2" fill="#fff" transform="rotate(60 450 195)" />

        {/* Warm Rim Highlight */}
        <ellipse cx="395" cy="165" rx="35" ry="15" fill="#ffffff" opacity="0.3" />
      </svg>
    </div>
  );
};
