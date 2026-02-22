import { GoogleGenAI, Type } from "@google/genai";

// This MUST match the name VITE_GEMINI_API_KEY exactly
const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("API Key not found! Check your Vercel settings. Make sure it starts with VITE_.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse news", e);
      return [];
    }
  },

  async summarizeArticle(content: string, level: string): Promise<string> {
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

    return response.text || "Summary unavailable.";
  },

  async detectFakeNews(text: string): Promise<{ score: number; reasoning: string; sources: string[] }> {
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
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { score: 50, reasoning: "Analysis failed.", sources: [] };
    }
  },

  async translateArticle(content: string, targetLang: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following news article to ${targetLang}. Preserve the professional journalistic tone and adapt regional cultural context where appropriate.\n\nContent: ${content}`,
    });

    return response.text || content;
  },

  async predictTrends(): Promise<string[]> {
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
      return JSON.parse(response.text || "[]");
    } catch (e) {
      return ["Global Economy", "AI Advancements", "Climate Action", "Space Exploration", "Health Tech"];
    }
  },

  async generateExamQuestions(content: string): Promise<{ questions: string[]; type: string }> {
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
      return JSON.parse(response.text || "{}");
    } catch (e) {
      return { questions: [], type: "Exam Mode" };
    }
  }
};
