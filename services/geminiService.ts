import { GoogleGenAI, Type } from "@google/genai";
import { AiLyricsResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativeMetadata = async (
  trackTitle: string,
  vibeDescription: string
): Promise<AiLyricsResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      I am a musician uploading a song called "${trackTitle}".
      The vibe is: ${vibeDescription}.
      
      Please generate:
      1. A short snippet of creative lyrics (chorus).
      2. A specific electronic sub-genre.
      3. A mood description for metadata.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lyrics: { type: Type.STRING },
            suggestedGenre: { type: Type.STRING },
            mood: { type: Type.STRING },
          },
          required: ["lyrics", "suggestedGenre", "mood"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AiLyricsResponse;
    }
    
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      lyrics: "Error generating lyrics.",
      suggestedGenre: "Unknown",
      mood: "Unknown",
    };
  }
};

export const analyzeDistributionTrend = async (dataPoints: string): Promise<string> => {
  // Simulates analyzing market trends for the artist dashboard
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze these music streaming trends and give a 1 sentence strategic advice for an independent artist: ${dataPoints}`,
    });
    return response.text || "Focus on building community engagement.";
  } catch (e) {
    return "Data analysis unavailable.";
  }
};
