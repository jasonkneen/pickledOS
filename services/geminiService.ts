import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.warn("API Key not found in environment variables");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export const initializeChat = (systemInstruction?: string) => {
    const ai = getAI();
    chatSession = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: systemInstruction || "You are Pickle, a helpful, privacy-focused AI assistant living inside the user's Memory OS. You have access to their connected data (simulated). Be concise, friendly, and helpful.",
        }
    });
    return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
    if (!chatSession) {
        initializeChat();
    }
    if (!chatSession) return "Error: Chat session not initialized.";

    try {
        const response: GenerateContentResponse = await chatSession.sendMessage({ message });
        return response.text || "I'm having trouble processing that thought right now.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I encountered a connection glitch. Please try again.";
    }
};

export const generateUnderstanding = async (memoryContent: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this memory fragment and provide 2 brief, insightful hypotheses or follow-up questions to help the user understand it better.\n\nMemory: "${memoryContent}"`,
        });
        return response.text || "Could not analyze memory.";
    } catch (e) {
        console.error(e);
        return "Analysis unavailable.";
    }
}
