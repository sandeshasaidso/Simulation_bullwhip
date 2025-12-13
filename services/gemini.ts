import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Role } from "../types";

// Helper to check for API Key
const getAI = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing!");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * FEATURE: Think more when needed
 * Uses Gemini 3 Pro with High Thinking Budget for deep analysis of the supply chain.
 */
export const analyzeCycle = async (gameState: GameState) => {
  const ai = getAI();
  
  // Construct a detailed prompt about the current state
  const historySummary = gameState.history.map(h => 
    `Cycle ${h.currentCycle}: Demand=${h.nodes[Role.END_USER].incomingOrder}, ` +
    `Distributor Order=${h.nodes[Role.DISTRIBUTOR].outgoingOrder}, ` +
    `Mfg Order=${h.nodes[Role.MANUFACTURER].outgoingOrder}`
  ).join('\n');

  const roleName = gameState.playerRole === Role.DISTRIBUTOR ? 'Distributor' : 'Manufacturer';

  const prompt = `
    You are a Supply Chain Coach. The user is playing as the ${roleName}.
    
    History of moves:
    ${historySummary}

    Task:
    Provide a 2-sentence tactical advice for the ${roleName} for the next turn to stabilize the supply chain.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Use flash for quick turn-by-turn advice
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Keep orders steady to avoid the bullwhip effect.";
  }
};

/**
 * FEATURE: Comprehensive Final Report
 * Uses Gemini 3 Pro to generate a markdown document.
 */
export const generateFinalReport = async (history: GameState[], playerRole: Role | null) => {
  const ai = getAI();
  const roleName = playerRole || 'Participant';
  
  // Compress history for token limit if needed, but 10 cycles is fine
  const dataPoints = history.map(h => 
    `Cycle ${h.currentCycle} | EndUserDemand: ${h.nodes[Role.END_USER].incomingOrder} | DistOrder: ${h.nodes[Role.DISTRIBUTOR].outgoingOrder} | MfgOrder: ${h.nodes[Role.MANUFACTURER].outgoingOrder}`
  ).join('\n');

  const prompt = `
    Create a professional "Supply Chain Post-Mortem Report" for a simulation game where the user played as the ${roleName}.

    Simulation Data:
    ${dataPoints}

    Output Format:
    Return a Markdown document with the following sections:
    # Supply Chain Performance Report
    ## Executive Summary
    (Summarize the stability of the supply chain and if the Bullwhip Effect (amplification of variance) occurred).
    
    ## Player Performance (${roleName})
    (Critique the user's ordering strategy. Did they panic? Did they smooth demand?)
    
    ## Key Observations
    (List 3 bullet points about specific cycles where things went wrong or right).

    ## Recommendations
    (2 actionable takeaways for real-world operations).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 } // Deep thinking for the final report
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "# Error Generating Report\nCould not connect to AI analyst.";
  }
};

/**
 * FEATURE: Use Google Maps data
 * Uses Gemini 2.5 Flash with Google Maps Tool to find logistics info.
 */
export const findLogisticsHubs = async (query: string, userLocation?: {lat: number, lng: number}) => {
  const ai = getAI();

  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };
    
    // Add location bias if available
    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find real-world logistics information relevant to: ${query}. 
      List 3 key locations or hubs with their addresses and a brief reason why they are important for supply chains.`,
      config: config
    });

    const text = response.text;
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { text, grounding };
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return { text: "Could not fetch map data.", grounding: [] };
  }
};

/**
 * FEATURE: Nano banana powered app
 * Edit/Generate warehouse assets using Gemini 2.5 Flash Image
 */
export const editAsset = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|webp|svg\+xml);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: `Edit this image to match the following description: ${prompt}. Maintain the icon-like style but apply the changes.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};
