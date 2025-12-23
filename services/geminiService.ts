import { GoogleGenAI, Modality } from "@google/genai";
import { ElementType, AnalysisResult, UserProfile, IntentResult } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas for structured output
const fireSchema = {
  type: "OBJECT",
  properties: {
    emotionalState: { type: "STRING" },
    likelyCauses: { 
      type: "ARRAY", 
      items: {
        type: "OBJECT",
        properties: {
          cause: { type: "STRING" },
          probability: { type: "STRING" }
        }
      } 
    },
    whatThisMeans: { type: "STRING" },
    safetyAdvice: { type: "STRING" },
    reassuranceLine: { type: "STRING" },
    reasoningSummary: { type: "STRING" }
  },
  required: ["emotionalState", "likelyCauses", "whatThisMeans", "safetyAdvice", "reassuranceLine", "reasoningSummary"]
};

const earthSchema = {
  type: "OBJECT",
  properties: {
    medicineIdentified: { type: "STRING" },
    authenticityConfidence: { type: "STRING" },
    redFlags: { type: "ARRAY", items: { type: "STRING" } },
    safetyAdvice: { type: "STRING" },
    reassuranceLine: { type: "STRING" },
    reasoningSummary: { type: "STRING" }
  },
  required: ["medicineIdentified", "authenticityConfidence", "safetyAdvice", "reassuranceLine"]
};

const spaceSchema = {
  type: "OBJECT",
  properties: {
    localizedExplanation: { type: "STRING" },
    wellnessSuggestions: { type: "ARRAY", items: { type: "STRING" } },
    culturalNotes: { type: "STRING" },
    reassuranceLine: { type: "STRING" },
    reasoningSummary: { type: "STRING" },
    safetyAdvice: { type: "STRING" }
  },
  required: ["localizedExplanation", "wellnessSuggestions", "reassuranceLine", "reasoningSummary", "safetyAdvice"]
};

const waterSchema = {
  type: "OBJECT",
  properties: {
    waterQualityRisk: { type: "STRING", enum: ["Low", "Moderate", "High"] },
    reportSummary: { type: "STRING" },
    reassuranceLine: { type: "STRING" },
    reasoningSummary: { type: "STRING" },
    safetyAdvice: { type: "STRING" }
  }
};

const airSchema = {
  type: "OBJECT",
  properties: {
    ocrInterpretation: { type: "STRING" },
    medications: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          dosage: { type: "STRING" },
          frequency: { type: "STRING" },
          duration: { type: "STRING" },
          instructions: { type: "STRING" },
          confidence: { type: "STRING", enum: ["High", "Medium", "Low"] }
        }
      }
    },
    ambiguityFlags: { type: "ARRAY", items: { type: "STRING" } },
    verificationRequired: { type: "BOOLEAN" },
    safetyAdvice: { type: "STRING" },
    reassuranceLine: { type: "STRING" },
    reasoningSummary: { type: "STRING" }
  },
  required: ["medications", "safetyAdvice", "reassuranceLine", "reasoningSummary"]
};

const intentSchema = {
  type: "OBJECT",
  properties: {
    targetElement: { type: "STRING", enum: ["FIRE", "EARTH", "WATER", "AIR", "SPACE"] },
    reasoning: { type: "STRING" }
  },
  required: ["targetElement", "reasoning"]
};

export const routeVoiceIntent = async (
  text: string,
  userProfile: UserProfile
): Promise<IntentResult> => {
  try {
    const prompt = `
    You are the Voice Router for Aether Health.
    Analyze the user's spoken input and route it to the correct Element.

    ELEMENT DEFINITIONS:
    - FIRE: Symptoms, pain, anxiety, feeling sick, "I don't feel well".
    - EARTH: Medicine authenticity, checking pills, packaging issues.
    - WATER: Water quality, environmental safety, "is this water safe".
    - AIR: Prescriptions, reading doctor's notes, dosage confusion.
    - SPACE: General wellness, translation, cultural advice, holistic health, or if the input is unclear/generic.

    USER INPUT: "${text}"
    USER LANGUAGE: ${userProfile.language}

    Return JSON with 'targetElement' and 'reasoning'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: intentSchema
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as IntentResult;
  } catch (error) {
    console.error("Intent Routing Error:", error);
    // Fallback to SPACE
    return { targetElement: ElementType.SPACE, reasoning: "Fallback to universal handler." };
  }
};

export const generateVoiceAudio = async (
  text: string,
  element: ElementType
): Promise<string | undefined> => {
  try {
    // Map Element to Voice
    let voiceName = 'Kore'; // Default (Fire)
    switch (element) {
      case ElementType.FIRE: voiceName = 'Kore'; break;
      case ElementType.EARTH: voiceName = 'Fenrir'; break;
      case ElementType.WATER: voiceName = 'Puck'; break;
      case ElementType.AIR: voiceName = 'Charon'; break;
      case ElementType.SPACE: voiceName = 'Zephyr'; break;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("Voice Generation Error:", error);
    return undefined;
  }
}

export const generateAetherResponse = async (
  element: ElementType,
  input: string,
  userProfile: UserProfile,
  imagePart?: string
): Promise<AnalysisResult> => {

  // MOCK RESPONSE FOR WATER (HydroGuard)
  // Simulating environmental sensor analysis for the demo
  if (element === ElementType.WATER) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing delay
    
    // Basic mock localization logic for demo purposes
    const isEn = userProfile.language === 'en';
    const isEs = userProfile.language === 'es';
    
    let summary = 'Simulated analysis of local reservoir inputs indicates slightly elevated turbidity levels due to recent seasonal rainfall.';
    let advice = 'Tap water remains safe for consumption.';
    let reassurance = 'City filtration systems are effectively managing the increased sediment load.';

    if (isEs) {
      summary = 'El análisis simulado indica niveles de turbidez ligeramente elevados debido a las lluvias recientes.';
      advice = 'El agua del grifo sigue siendo segura para el consumo.';
      reassurance = 'Los sistemas de filtración de la ciudad están gestionando eficazmente la carga de sedimentos.';
    }

    return {
      waterQualityRisk: 'Moderate',
      reportSummary: summary,
      reasoningSummary: 'Cross-referenced municipal sensor data with meteorological patterns.',
      safetyAdvice: advice,
      reassuranceLine: reassurance,
      whatThisMeans: isEn ? 'The water might look a bit cloudy, but it is safe.' : 'El agua puede parecer turbia, pero es segura.',
      emotionalState: 'Calm'
    };
  }

  let modelName = 'gemini-3-flash-preview';
  let systemPrompt = SYSTEM_INSTRUCTION;
  
  // INJECT USER PROFILE
  systemPrompt += `\n
  CRITICAL PROFILE CONTEXT:
  - User Language: ${userProfile.language}
  - Preferred Tone: ${userProfile.tone}
  - Accessibility: ${userProfile.accessibility.largeText ? 'Use simple, clear structure.' : 'Standard.'}
  
  Generate ALL output in the specified language: ${userProfile.language}.
  Adopt the requested tone: ${userProfile.tone}.
  `;

  let userPrompt = input;
  let responseSchema: any = {};

  switch (element) {
    case ElementType.FIRE:
      systemPrompt += `
      MODE: FIRE (VitalScan).
      Task: Analyze symptoms to reduce anxiety.
      1. Detect emotional tone (fear, panic, neutral).
      2. Identify likely causes using standard medical reasoning.
      3. Assign probabilities.
      4. Reassure the user.
      5. State clearly when to seek help.
      `;
      responseSchema = fireSchema;
      break;

    case ElementType.EARTH:
      modelName = 'gemini-2.5-flash-image';
      systemPrompt += `
      MODE: EARTH (TrueMeds).
      Task: Detect potential counterfeit medicine issues from packaging.
      1. Identify drug name if visible.
      2. Check for visual anomalies.
      3. Provide confidence score (High/Med/Low).
      4. Suggest verification steps.
      `;
      userPrompt = "Analyze this image of medicine packaging for authenticity cues.";
      break;

    case ElementType.SPACE:
      systemPrompt += `
      YOU ARE LIFELOOP (SPACE ELEMENT).
      Your role is to act as the unifying intelligence.
      
      INPUT: User input.
      TASK:
      1. Synthesize a "LifeLoop Summary".
      2. Adapt tone.
      3. Suggest 3-5 "Personalized Wellness Suggestions".
      4. Provide "Cultural & Language Adaptation".
      5. Provide "Gentle Guidance".

      OUTPUT MAPPING:
      - localizedExplanation: LifeLoop Summary in ${userProfile.language}.
      - wellnessSuggestions: List of holistic actions in ${userProfile.language}.
      - culturalNotes: Cultural adaptation notes.
      - safetyAdvice: Guidance on next steps in ${userProfile.language}.
      - reassuranceLine: Closing supportive sentence in ${userProfile.language}.
      - reasoningSummary: Brief explanation in ${userProfile.language}.
      `;
      responseSchema = spaceSchema;
      break;

    case ElementType.AIR:
      modelName = 'gemini-2.5-flash-image';
      systemPrompt += `
      MODE: AIR (ClearScript).
      Task: Prevent prescription errors by clarifying instructions.
      
      INPUT: Prescription Image or Text.
      ACTIONS:
      1. Perform OCR to read text.
      2. Normalize handwriting and correct spellings against known medical drugs.
      3. Extract specific medications, dosages, frequencies, and instructions.
      4. Flag any ambiguities or low confidence reads.
      5. Provide simple patient-safe instructions.
      
      SAFETY RULES:
      - Never guess. If a word is illegible, flag it.
      - Do not provide diagnosis.
      
      OUTPUT FIELDS:
      - ocrInterpretation: A summary of what was read.
      - medications: List of identified meds with details.
      - ambiguityFlags: List of unclear items.
      - verificationRequired: Boolean, true if low confidence.
      - safetyAdvice: Warnings or "Ask your pharmacist".
      - reassuranceLine: Calming closing.
      `;
      if (!userPrompt) userPrompt = "Analyze this prescription for clarity and safety.";
      // We do not set responseSchema variable here for config usage because Air uses gemini-2.5-flash-image
      break;
  }

  try {
    const config: any = {
      systemInstruction: systemPrompt,
    };

    // EARTH and AIR use gemini-2.5-flash-image which does NOT support responseMimeType: "application/json"
    if (element !== ElementType.EARTH && element !== ElementType.AIR) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    let contents: any = userPrompt;

    if (imagePart && (element === ElementType.EARTH || element === ElementType.AIR)) {
      contents = {
        parts: [
          { inlineData: { mimeType: 'image/png', data: imagePart } },
          { text: userPrompt }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};