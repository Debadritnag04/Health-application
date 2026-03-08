🌿 Aether Health

Harmonizing Global Health with the Elements of Nature.

Aether Health is a holistic, AI-powered web platform that reimagines the "last mile" of healthcare delivery through the lens of the five elements of nature: Fire, Water, Air, Earth, and Space.

Unlike traditional medical apps that feel clinical and anxiety-inducing, Aether Health provides a calm, culturally inclusive experience. It solves critical issues—from "Cyberchondria" (health anxiety) to counterfeit medicines and unsafe water—by grounding every AI decision in verified medical data and utilizing the advanced multimodal capabilities of the Google Gemini API.

✨ Core Features: The Five-Element Framework

🔥 Fire: VitalScan (Diagnostics & Vitality)

The Problem: People panic after Googling symptoms, often misinterpreting mild issues as fatal diseases.

The Solution: An "Empathetic Healer" symptom checker. Powered by Gemini, it detects user anxiety via sentiment analysis and adjusts its tone to be calming. It uses Retrieval-Augmented Generation (RAG) against verified WHO Clinical Guidelines to provide probability-based, reassuring assessments (e.g., "85% Acid Reflux, 5% Cardiac").

💧 Water: HydroGuard (Purity & Flow)

The Problem: Citizens lack real-time, accessible data on local water safety and contamination.

The Solution: An interactive map visualizing safe and unsafe water zones. It features a "Citizen Science" tool allowing users to snap photos of contamination (e.g., sewage leaks), auto-capturing GPS coordinates to generate tickets for local officials.

🌬️ Air: ClearScript (Communication & Breath)

The Problem: Illegible doctor handwriting leads to dangerous medication errors.

The Solution: Uses Gemini Multimodal Vision to scan and decipher messy handwritten prescriptions. It automatically extracts the raw text, intelligently corrects misspelled drug names using medical datasets, and extracts dosage schedules to set patient reminders.

🌍 Earth: TrueMeds (Stability & Substance)

The Problem: Up to 20% of medicines sold in developing nations are counterfeit.

The Solution: A visual counterfeit defense system. Users upload a photo of their medicine, and Gemini Vision analyzes both the packaging (fonts, logo alignment) and the physical pill (shape, color) to verify its authenticity against a "Golden Dataset" of genuine drugs.

🌌 Space: LifeLoop (Universal Connection)

The Problem: Healthcare is often fragmented, and digital tools exclude non-English speakers.

The Solution: The holistic intelligence layer. It uses the Gemini API to instantly translate the entire app interface and medical advice into local dialects. It also aggregates data from the other elements to provide holistic lifestyle advice (e.g., suggesting a cooling breathing exercise if the Fire element detects high anxiety).

🛠️ Tech Stack

This project is designed as a modern, scalable web application, utilizing a cost-effective, serverless-friendly architecture.

Frontend: React.js (Vite), Tailwind CSS (for "Glassmorphism" UI), Framer Motion (for elemental animations)

Backend: Node.js / Express (RESTful API)

AI & Machine Learning: Google Gemini API (Gemini 1.5/2.5 Pro & Flash)

Text Processing: For empathetic chat, symptom analysis, and translation.

Multimodal Vision: For prescription OCR (Air) and visual counterfeit detection (Earth).

Database & Storage: MongoDB / Firebase (for user profiles, chat history, and image storage)

Maps: Google Maps API / Mapbox (for HydroGuard)

🚀 Getting Started

Prerequisites

Node.js (v18+)

A Google AI Studio Account (for your Gemini API Key)

MongoDB URI or Firebase Config

Installation

Clone the repository:

git clone [https://github.com/yourusername/aether-health.git](https://github.com/yourusername/aether-health.git)
cd aether-health


Install dependencies:

# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install


Environment Setup:
Create a .env file in the server directory and add your API keys:

PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
DATABASE_URL=your_database_connection_string


Run the application:

# Run the backend (from the /server folder)
npm run dev

# Run the frontend (from the /client folder)
npm run dev


🛡️ Responsible AI & Trust

Aether Health is built with Trust & Safety first.

No Hallucinations: We ground diagnostic advice in verified WHO datasets.

Explainability: The "Element Tick-Mark Traceability" feature shows users exactly which data source contributed to a health recommendation.

Decision Support, Not Diagnosis: The platform is explicitly designed to support and calm users, always recommending professional medical consultation for serious issues.
