import { GoogleGenAI, Type } from "@google/genai";

// This MUST match the name VITE_GEMINI_API_KEY exactly
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("API Key not found! Check your Vercel settings. Make sure it starts with VITE_.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // Increase to 1 hour for better quota management

const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: "fallback-1",
    title: "Global Tech Summit Announces Breakthrough in Sustainable Energy",
    content: "Leading scientists and tech giants gathered today to unveil a revolutionary solid-state battery technology that promises to triple the range of electric vehicles while reducing charging times to under five minutes. The breakthrough, a result of a decade-long international collaboration, uses recycled materials and significantly reduces the environmental footprint of battery production. Industry experts predict this could accelerate the transition to renewable energy by several years, making green transportation accessible to millions more people worldwide.",
    category: "Technology",
    author: "Sarah Jenkins",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/tech1/800/600"
  },
  {
    id: "fallback-2",
    title: "New Global Policy Aims to Protect 30% of Oceans by 2030",
    content: "In a historic move, over 190 nations have signed a comprehensive treaty to establish vast marine protected areas in international waters. The agreement provides a legal framework for conservation in the 'High Seas,' which cover nearly half the Earth's surface but have previously been largely unregulated. Marine biologists hailed the treaty as a 'turning point' for biodiversity, noting that it will help protect endangered species, restore depleted fish stocks, and enhance the ocean's ability to absorb carbon dioxide from the atmosphere.",
    category: "Politics",
    author: "Michael Chen",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/ocean1/800/600"
  },
  {
    id: "fallback-3",
    title: "The Future of Remote Work: Hybrid Models Become the New Standard",
    content: "A comprehensive study of 5,000 global companies reveals that the hybrid work model has officially surpassed both fully remote and fully in-office setups as the preferred choice for employees and employers alike. The report highlights that flexibility is now the top priority for job seekers, leading to a significant shift in urban planning and commercial real estate. Cities are beginning to adapt by converting vacant office spaces into residential units and community hubs, reflecting a permanent change in how society balances professional and personal life.",
    category: "Lifestyle",
    author: "Elena Rodriguez",
    date: "Feb 23, 2026",
    imageUrl: "https://picsum.photos/seed/work1/800/600"
  }
];

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 3000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes("429") || error?.status === 429 || error?.code === 429;
    if (isRateLimit && retries > 0) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: "Politics" | "Sports" | "Lifestyle" | "Economy" | "Health" | "Urban" | "Technology";
  author: string;
  date: string;
  imageUrl: string;
  summary?: string;
}

export const geminiService = {
  async generateNews(category: string = "General"): Promise<NewsArticle[]> {
    const cacheKey = `news_${category}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 10 highly realistic and current news articles for the category: ${category}. 
        Return them as a JSON array of objects with: id, title, content (at least 200 words), category, author, date, and a descriptive imageUrl placeholder (e.g., https://picsum.photos/seed/news1/800/600).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING },
                author: { type: Type.STRING },
                date: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
              },
              required: ["id", "title", "content", "category", "author", "date", "imageUrl"],
            },
          },
        },
      });

      try {
        const data = JSON.parse(response.text || "[]");
        if (data && Array.isArray(data) && data.length > 0) {
          cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        }
        throw new Error("Invalid news data received");
      } catch (e) {
        console.error("Failed to parse news, using fallback", e);
        return FALLBACK_NEWS;
      }
    }).catch(() => {
      console.warn("API failed after retries, serving fallback news.");
      return FALLBACK_NEWS;
    });
  },

  async summarizeArticle(content: string, level: string): Promise<string> {
    const cacheKey = `summary_${content.substring(0, 50)}_${level}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const prompts: Record<string, string> = {
        "30-word": "Summarize this news in exactly 30 words.",
        "100-word": "Summarize this news in exactly 100 words.",
        "bullet": "Provide a bullet-point summary of the key facts.",
        "exam": "Summarize this news in an analytical way suitable for a competitive exam (UPSC style).",
        "tweet": "Create a catchy tweet-ready summary with hashtags.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompts[level] || prompts["30-word"]}\n\nContent: ${content}`,
      });

      const text = response.text || "Summary unavailable.";
      cache.set(cacheKey, { data: text, timestamp: Date.now() });
      return text;
    });
  },

  async detectFakeNews(text: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
    const cacheKey = `fake_${text.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following news text for authenticity. Check for sensationalism, logical fallacies, and verify against known facts. 
        Text: ${text}`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Authenticity score from 0 to 100" },
              reasoning: { type: Type.STRING },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "reasoning", "sources"],
          },
        },
      });

      try {
        const data = JSON.parse(response.text || "{}");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (e) {
        return { score: 50, reasoning: "Analysis failed.", sources: [] };
      }
    });
  },

  async translateArticle(content: string, targetLang: string): Promise<string> {
    const cacheKey = `trans_${content.substring(0, 50)}_${targetLang}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following news article to ${targetLang}. Preserve the professional journalistic tone and adapt regional cultural context where appropriate.\n\nContent: ${content}`,
      });

      const text = response.text || content;
      cache.set(cacheKey, { data: text, timestamp: Date.now() });
      return text;
    });
  },

  async predictTrends(): Promise<string[]> {
    const cacheKey = "trends";
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Based on current global events, predict 5 trending news topics for the next 48 hours. Return as a simple list.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      try {
        const data = JSON.parse(response.text || "[]");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (e) {
        return ["Global Economy", "AI Advancements", "Climate Action", "Space Exploration", "Health Tech"];
      }
    });
  },

  async generateExamQuestions(content: string): Promise<{ questions: string[]; type: string }> {
    const cacheKey = `exam_${content.substring(0, 50)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on this news article, generate 3 UPSC-style MCQs and 2 descriptive interview questions.\n\nContent: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              type: { type: Type.STRING }
            },
            required: ["questions", "type"]
          }
        }
      });

      try {
        const data = JSON.parse(response.text || "{}");
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
      } catch (e) {
        return { questions: [], type: "Exam Mode" };
      }
    });
  },

  async analyzeNewsImage(base64Image: string, mimeType: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
    return withRetry(async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image of a news article or headline. Verify its authenticity by cross-referencing with current global news using Google Search. Determine if it is real or fake news. Provide an authenticity score (0-100), reasoning, and list verified sources.",
          },
        ],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Authenticity score from 0 to 100" },
              reasoning: { type: Type.STRING },
              sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["score", "reasoning", "sources"],
          },
        },
      });

      try {
        return JSON.parse(response.text || "{}");
      } catch (e) {
        return { score: 50, reasoning: "Image analysis failed.", sources: [] };
      }
    });
  }
};
