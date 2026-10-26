import { GoogleGenAI } from "@google/genai";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-memory cache for generated TTS audio to ensure instant replay
const ttsCache = new Map<string, { audioBase64: string; mimeType: string }>();

// Predefined 15-second narration segments as requested by user
const BIBIMBAP_SEGMENTS = [
  {
    id: 1,
    timeRange: "Act 1",
    title: "The Colorful Harmony",
    text: "Bibimbap isn't just a rice bowl, it's a bowl of colorful harmony!",
    voice: "Kore",
    style: "Warm, inviting, clear storytelling narrator with natural pacing",
  },
  {
    id: 2,
    timeRange: "Act 2",
    title: "The Savory Mix",
    text: "Add savory Gochujang red pepper paste to fresh vegetables and mix it all together.",
    voice: "Kore",
    style: "Dynamic, rhythmic, enthusiastic food documentary host",
  },
  {
    id: 3,
    timeRange: "Act 3",
    title: "Taste of Korea",
    text: "Enjoy a healthy, delicious meal! Welcome to Korea!",
    voice: "Kore",
    style: "Celebratory, warm, welcoming hospitality",
  },
];

// Health and info check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey),
    segments: BIBIMBAP_SEGMENTS,
  });
});

// Segment metadata API
app.get("/api/narration-segments", (_req: Request, res: Response) => {
  res.json({
    segments: BIBIMBAP_SEGMENTS,
  });
});

// TTS Generation API using Gemini 3.8 Flash Lite TTS
app.post("/api/tts", async (req: Request, res: Response) => {
  const { text, voice = "Kore", style = "Appetizing food documentary host", segmentId } = req.body;

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Text is required" });
    return;
  }

  const cacheKey = `${voice}_${text.trim()}`;
  if (ttsCache.has(cacheKey)) {
    const cached = ttsCache.get(cacheKey)!;
    res.json({
      success: true,
      cached: true,
      segmentId,
      audioBase64: cached.audioBase64,
      mimeType: cached.mimeType,
    });
    return;
  }

  if (!ai) {
    // If no API key configured, signal client to use browser Web Speech API or synthesized audio
    res.json({
      success: false,
      reason: "GEMINI_API_KEY is not configured",
      fallbackToSpeechSynthesis: true,
      text,
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: style || "Clear, warm, appetizing culinary host",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      throw new Error("No audio payload returned from Gemini TTS");
    }

    const result = {
      audioBase64,
      mimeType: "audio/wav",
    };

    ttsCache.set(cacheKey, result);

    res.json({
      success: true,
      cached: false,
      segmentId,
      audioBase64,
      mimeType: "audio/wav",
    });
  } catch (error: any) {
    console.error("Gemini TTS generation error:", error?.message || error);
    res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate speech",
      fallbackToSpeechSynthesis: true,
      text,
    });
  }
});

// Vite middleware mounting in development, static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  const port = Number(process.env.PORT) || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`[Bibimbap Cinema Server] Running on http://localhost:${port}`);
  });
}

startServer();
