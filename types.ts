import React from 'react';

export enum ElementType {
  FIRE = 'FIRE',
  EARTH = 'EARTH',
  WATER = 'WATER',
  AIR = 'AIR',
  SPACE = 'SPACE'
}

export interface ElementConfig {
  id: ElementType;
  name: string;
  tagline: string;
  description: string;
  
  // Styling
  gradientFrom: string;
  gradientTo: string;
  textAccent: string;
  bg: string;
  color: string;
  
  icon: React.FC<any>;
  inputType: 'text' | 'image' | 'mock_action';
  placeholder?: string;
}

// Structure for the JSON response from Gemini
export interface AnalysisResult {
  // Fire
  emotionalState?: string;
  likelyCauses?: Array<{ cause: string; probability: string }>;
  
  // Earth
  medicineIdentified?: string;
  authenticityConfidence?: string;
  redFlags?: string[];
  
  // Space
  localizedExplanation?: string;
  wellnessSuggestions?: string[];
  culturalNotes?: string;

  // Water
  waterQualityRisk?: 'Low' | 'Moderate' | 'High';
  reportSummary?: string;

  // Air
  ocrInterpretation?: string;
  ambiguityFlags?: string[];
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    confidence: 'High' | 'Medium' | 'Low';
  }>;
  verificationRequired?: boolean;

  // Common
  reasoningSummary: string; // For Trust Panel
  safetyAdvice: string; // "When to seek help" or "Safety Advice"
  reassuranceLine: string; // The closing supportive line
  whatThisMeans?: string; // General explanation
}

export interface IntentResult {
  targetElement: ElementType;
  reasoning: string;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';
export type Tone = 'calm' | 'neutral' | 'supportive';

export interface UserProfile {
  language: Language;
  tone: Tone;
  voiceResponse: boolean;
  accessibility: {
    largeText: boolean;
  };
}