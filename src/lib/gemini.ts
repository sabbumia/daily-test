// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

export interface WordTest {
  word: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

export async function generateDailyTest(): Promise<WordTest[]> {
  const prompt = `Generate exactly 10 English vocabulary words with their meanings for a daily test.
For each word, provide:
1. The word
2. The correct meaning
3. Three incorrect but plausible alternative meanings
Format your response as a JSON array with this structure:
[
  {
    "word": "example",
    "meaning": "correct meaning",
    "options": ["correct meaning", "wrong meaning 1", "wrong meaning 2", "wrong meaning 3"]
  }
]
Make sure:
- Words are at intermediate to advanced level
- All 4 options are shuffled (correct answer can be at any position)
- Wrong options are plausible but clearly incorrect
- Each word is unique and useful for learning
Return ONLY the JSON array, no additional text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });
    
    const text = response.text;
    
    // Check if text is undefined
    if (!text) {
      throw new Error('No response text received from Gemini');
    }
    
    // Remove markdown code blocks if present
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const words: WordTest[] = JSON.parse(jsonText);
    
    // Validate the response
    if (!Array.isArray(words) || words.length !== 10) {
      throw new Error('Invalid response format from Gemini');
    }
    
    // Ensure each word has the correct structure
    return words.map(word => ({
      word: word.word,
      meaning: word.meaning,
      options: word.options,
      correctAnswer: word.meaning,
    }));
  } catch (error) {
    console.error('Error generating test with Gemini:', error);
    throw new Error('Failed to generate daily test');
  }
}