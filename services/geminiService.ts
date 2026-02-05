
import { GoogleGenAI, Type } from "@google/genai";
import { EnglishLevel, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePracticeContent = async (
  profile: UserProfile,
  words: string[],
  day: number
) => {
  const model = 'gemini-3-flash-preview';
  
  let prompt = '';
  if (day === 3) {
    prompt = `Generate 3 short English sentences for an English learner at ${profile.level} level. 
    The learner's goal is ${profile.goal} ${profile.profession ? `(Profession: ${profile.profession})` : ''}.
    Use 3 or 4 words from this list: [${words.join(', ')}]. 
    Keep the sentences simple and direct for a mobile notification.
    Return the response as a JSON array of strings.`;
  } else if (day === 4) {
    prompt = `Generate a very short English text (~3 lines, max 30 words) for an English learner at ${profile.level} level.
    The learner's goal is ${profile.goal} ${profile.profession ? `(Profession: ${profile.profession})` : ''}.
    The text MUST include all of these words: [${words.join(', ')}].
    Keep it professional and clear.
    Return the response as a JSON object with a 'text' property.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
