import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, MessageRole, GeminiModel, ImageSize } from "../types";

// Helper to get the AI client
// We create a fresh instance to ensure we pick up any API key changes if necessary
const getAiClient = async () => {
    // Check for AI Studio specific key selection for advanced features if available in environment
    // Note: In standard deployment, process.env.API_KEY is used.
    // The instructions mention window.aistudio for Veo/High-Res images.
    let apiKey = process.env.API_KEY;
    
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
         // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
             // @ts-ignore
             // The key is injected via internal mechanism when using window.aistudio
             // But the SDK expects it in constructor. 
             // In the provided specific instructions, it says:
             // "The selected API key is available via process.env.API_KEY. It is injected automatically"
             // So we just rely on process.env.API_KEY being updated.
        }
    }

    if (!apiKey) {
        console.warn("No API Key found in environment.");
    }

    return new GoogleGenAI({ apiKey: apiKey });
};

export const generateAnalysis = async (
  modelName: string,
  history: ChatMessage[],
  newMessage: string,
  contextData?: string,
  toolsConfig?: { search?: boolean; maps?: boolean; location?: { lat: number; lng: number } }
): Promise<GenerateContentResponse> => {
  const ai = await getAiClient();
  
  // Construct system instruction
  let systemInstruction = "You are an intelligent data analyst assistant named Nexus AI. You help users understand their data.";
  if (contextData) {
    systemInstruction += `\n\nHere is the current dataset context (first 50 rows JSON):\n${contextData}\n\nAnalyze this data when asked.`;
  }

  const tools: any[] = [];
  const toolConfig: any = {};

  if (toolsConfig?.search) {
    tools.push({ googleSearch: {} });
  }

  if (toolsConfig?.maps) {
    tools.push({ googleMaps: {} });
    if (toolsConfig.location) {
      toolConfig.retrievalConfig = {
        latLng: {
          latitude: toolsConfig.location.lat,
          longitude: toolsConfig.location.lng
        }
      };
    }
  }

  // Format history for the API
  // Filter out system messages or error messages that aren't part of the conversation flow if needed
  // But strictly, we just start a chat or generate content. 
  // For simplicity with tools, we use generateContent but formatted as a chat if we were maintaining state on server,
  // but here we are stateless per request mostly, or using chat helper.
  // Tools are easier with generateContent for single turn, but Chat is better for history.
  // Let's use Chat.

  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction,
      tools: tools.length > 0 ? tools : undefined,
      toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
    },
    history: history.filter(m => m.role !== MessageRole.SYSTEM).map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }))
  });

  return await chat.sendMessage({ message: newMessage });
};

export const generateImage = async (
  prompt: string,
  size: ImageSize
): Promise<{ imageUrl: string | null; error?: string }> => {
  try {
    // Specific logic for checking key selection for high-end models as requested
    // @ts-ignore
    if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
        }
    }

    const ai = await getAiClient();
    
    // gemini-3-pro-image-preview supports imageSize
    const response = await ai.models.generateContent({
      model: GeminiModel.IMAGE_PRO,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1" // Default square
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return { imageUrl: `data:image/png;base64,${base64String}` };
      }
    }
    
    return { imageUrl: null, error: "No image generated." };

  } catch (err: any) {
      // Handle the specific error mentioned in instructions
      if (err.message && err.message.includes("Requested entity was not found")) {
           // @ts-ignore
           if (window.aistudio && window.aistudio.openSelectKey) {
                // @ts-ignore
               await window.aistudio.openSelectKey();
               return { imageUrl: null, error: "API Key reset required. Please try again." };
           }
      }
      return { imageUrl: null, error: err.message || "Unknown error" };
  }
};
