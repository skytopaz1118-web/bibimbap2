import introImage from "../assets/images/bibimbap_intro_steam_1792391339374.jpg";
import mixingImage from "../assets/images/bibimbap_mixing_yolk_1792391339948.jpg";
import spoonImage from "../assets/images/bibimbap_spoon_lift_1792391340016.jpg";

export interface SceneData {
  id: number;
  timeRange: string;
  startTime: number;
  endTime: number;
  duration: number;
  title: string;
  tagline: string;
  imageSrc: string;
  animationClass: string;
  cameraMovement: string;
  narrationText: string;
  highlights: string[];
  sensoryDescription: string;
}

export const BIBIMBAP_SCENES: SceneData[] = [
  {
    id: 1,
    timeRange: "0:00 – 0:06",
    startTime: 0,
    endTime: 6.5,
    duration: 6.5,
    title: "The Colorful Harmony",
    tagline: "Vibrant Fresh Ingredients & Steaming Earthenware Bowl",
    imageSrc: introImage,
    animationClass: "animate-kenburns-1",
    cameraMovement: "Slow, cinematic 4K macro zoom-in over rising aromatic steam",
    narrationText: "Bibimbap isn't just a rice bowl, it's a bowl of colorful harmony!",
    highlights: [
      "Vibrant Green Zucchini",
      "Sweet Julienned Carrots",
      "Savory Sautéed Shiitake Mushrooms",
      "Glossy Centered Golden Egg Yolk",
      "Traditional Stone Earthenware Bowl"
    ],
    sensoryDescription: "Soft curling steam rising from hot rice, showcasing the five cardinal colors of nutrition and aesthetic balance."
  },
  {
    id: 2,
    timeRange: "0:06 – 0:14",
    startTime: 6.5,
    endTime: 14.0,
    duration: 7.5,
    title: "The Savory Mix",
    tagline: "Breaking the Golden Yolk & Rhythmic Mixing",
    imageSrc: mixingImage,
    animationClass: "animate-kenburns-2",
    cameraMovement: "Close-up action tracking spoon pop, velvety yolk cascade & dynamic swirl",
    narrationText: "Add savory Gochujang red pepper paste to fresh vegetables and mix it all together.",
    highlights: [
      "Rich Golden Egg Yolk Bursting",
      "Fermented Savory Gochujang Chili Paste",
      "Fragrant Toasted Sesame Oil Aroma",
      "Crisp Garden Vegetables",
      "Rhythmic Silver Spoon Mixing"
    ],
    sensoryDescription: "The satisfying pop of the rich egg yolk cascading over fluffy rice, merging with deep red chili paste into glistening perfection."
  },
  {
    id: 3,
    timeRange: "0:14 – 0:20",
    startTime: 14.0,
    endTime: 20.0,
    duration: 6.0,
    title: "Taste of Korea",
    tagline: "The Perfect Glistening Bite & Warm Hospitality",
    imageSrc: spoonImage,
    animationClass: "animate-kenburns-3",
    cameraMovement: "Hero macro lift toward lens with warm restaurant bokeh background",
    narrationText: "Enjoy a healthy, delicious meal! Welcome to Korea!",
    highlights: [
      "Heaped Spoonful of Ultimate Flavor",
      "Nutrient-dense Complete Balanced Meal",
      "Authentic Dining Atmosphere",
      "Warm Welcome to Global Travelers",
      "Crispy Scorched Rice Crust"
    ],
    sensoryDescription: "A mouthwatering spoonful shining with sesame seeds and fragrant oil, inviting travelers to savor Korea's most iconic comfort food."
  }
];

export interface IngredientInfo {
  name: string;
  category: string;
  color: string;
  symbolism: string;
  flavor: string;
  nutrition: string;
}

export const BIBIMBAP_INGREDIENTS: IngredientInfo[] = [
  {
    name: "Golden Egg Yolk",
    category: "Centerpiece",
    color: "from-amber-400 to-yellow-500",
    symbolism: "Earth (Yellow) - Center of harmony and nourishing energy",
    flavor: "Rich, creamy, velvety mouthfeel that softens spice",
    nutrition: "High quality protein, healthy fats, and essential choline"
  },
  {
    name: "Gochujang Red Chili Paste",
    category: "Fermented Sauce",
    color: "from-red-600 to-rose-700",
    symbolism: "Fire (Red) - Warmth, passion, and vitality",
    flavor: "Smoky, spicy-sweet fermented umami kick",
    nutrition: "Natural capsaicin and gut-friendly fermented probiotics"
  },
  {
    name: "Tender Green Zucchini",
    category: "Garden Vegetable",
    color: "from-emerald-500 to-green-600",
    symbolism: "Wood (Green) - Freshness, vitality, and renewal",
    flavor: "Delicately sweet, tender-crisp texture sautéed in sesame oil",
    nutrition: "Rich in Vitamins A, C, and dietary potassium"
  },
  {
    name: "Julienned Sweet Carrots",
    category: "Root Vegetable",
    color: "from-orange-500 to-amber-600",
    symbolism: "Warmth & Radiance - Natural sweetness and brightness",
    flavor: "Sweet, crisp crunch creating contrast against soft rice",
    nutrition: "Packed with beta-carotene and dietary fiber"
  },
  {
    name: "Soybean Sprouts",
    category: "Crunchy Topping",
    color: "from-amber-200 to-yellow-100",
    symbolism: "Metal (White) - Purity, lightness, and balance",
    flavor: "Nutty, crisp, refreshing crunch seasoned with garlic and sesame",
    nutrition: "High in plant protein and Vitamin C"
  },
  {
    name: "Shiitake Mushrooms",
    category: "Umami Mushroom",
    color: "from-stone-700 to-stone-900",
    symbolism: "Water (Black) - Deep earthiness, depth, and wellness",
    flavor: "Earthy, meaty, rich savory umami notes",
    nutrition: "Immune-supporting beta-glucans and B-vitamins"
  }
];
