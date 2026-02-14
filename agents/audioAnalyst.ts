
import { GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_AUDIO_ANALYST } from "../prompts";
import { retryWithBackoff, wrapGenAIError, getAIClient, cleanAndParseJSON } from "../utils";
import { MODEL_AUDIO_ANALYZER } from "../constants";
import { AudioAnalysisResult } from "../types";

export const runAudioAnalysisAgent = async (
  audioData: string, 
  mimeType: string,
  model: string = MODEL_AUDIO_ANALYZER
): Promise<string> => {
  const ai = getAIClient();
  
  const audioPart = {
    inlineData: {
      mimeType: mimeType,
      data: audioData
    }
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      trackName: { type: Type.STRING },
      musicalMetadata: {
        type: Type.OBJECT,
        properties: {
          globalKey: { type: Type.STRING, description: "e.g., C Minor, G# Major" },
          scale: { type: Type.STRING, description: "e.g., Pentatonic, Raga Mohanam" },
          detectedModulations: { type: Type.ARRAY, items: { type: Type.STRING } },
          tempoBPM: { type: Type.NUMBER },
          timeSignature: { type: Type.STRING, description: "e.g. 4/4, 6/8" },
          rhythmicFeel: { type: Type.STRING }
        },
        required: ["globalKey", "tempoBPM", "timeSignature"]
      },
      structure: {
        type: Type.OBJECT,
        properties: {
          totalBarsEstimate: { type: Type.NUMBER },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Intro, Verse, Chorus, etc." },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                confidence: { type: Type.NUMBER, description: "0.0 to 1.0" },
                alternateLabel: { type: Type.STRING },
                energyLevel: { type: Type.NUMBER, description: "0.0 to 1.0" },
                emotionCategory: { type: Type.STRING }
              },
              required: ["label", "startTime", "endTime", "confidence", "energyLevel"]
            }
          }
        },
        required: ["sections"]
      },
      profiles: {
        type: Type.OBJECT,
        properties: {
          rhythmicDensity: { type: Type.STRING, enum: ["Sparse", "Medium", "Dense", "Very Dense"] },
          densityDescription: { type: Type.STRING },
          dynamicCurve: { type: Type.STRING },
          instrumentation: { type: Type.ARRAY, items: { type: Type.STRING } },
          timbreTags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["rhythmicDensity", "instrumentation"]
      },
      emotionalDimensions: {
        type: Type.OBJECT,
        properties: {
          valence: { type: Type.NUMBER, description: "0 (Sad) to 1 (Happy)" },
          arousal: { type: Type.NUMBER, description: "0 (Calm) to 1 (Intense)" },
          description: { type: Type.STRING }
        },
        required: ["valence", "arousal", "description"]
      },
      syllableBlueprint: { type: Type.STRING, description: "Instructions for the lyricist" }
    },
    required: ["musicalMetadata", "structure", "profiles", "emotionalDimensions", "syllableBlueprint"]
  };

  try {
    const response = await retryWithBackoff(async () => await ai.models.generateContent({
      model: model,
      contents: {
        role: "user",
        parts: [
            audioPart,
            { text: "Analyze this track. Extract key, tempo, sections, rhythm, and emotion in strict JSON format." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_AUDIO_ANALYST,
        temperature: 0.1, // Strict analysis
        responseMimeType: "application/json",
        responseSchema: schema
      }
    }), model) as GenerateContentResponse;

    if (!response.text) return "Audio Analysis Failed.";

    // Parse to ensure validity, then stringify to pass to Orchestrator (which expects string context)
    // In a real app, we might pass the object, but for now we conform to the existing flow 
    // while providing a formatted string for the Lyricist and Raw JSON for the UI if needed.
    const result = cleanAndParseJSON<AudioAnalysisResult>(response.text);
    
    // We return a stringified version of the result so downstream agents can parse it
    // or the Orchestrator can stick it into the prompt.
    return JSON.stringify(result, null, 2);

  } catch (error) {
    throw wrapGenAIError(error);
  }
};