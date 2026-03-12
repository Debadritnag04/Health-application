# 🌿 Aether Health

> **Harmonizing Global Health with the Elements of Nature**

Aether Health is a holistic, AI-powered web platform that reimagines healthcare delivery through the lens of the five elements of nature: Fire, Water, Air, Earth, and Space.

Unlike traditional medical apps that feel clinical and anxiety-inducing, Aether Health provides a calm, culturally inclusive experience. It solves critical healthcare challenges—from health anxiety to counterfeit medicines—by grounding every AI decision in verified medical data and utilizing Google Gemini API's advanced multimodal capabilities.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)

---

## ✨ Features: The Five-Element Framework

### 🔥 Fire: VitalScan (Diagnostics & Vitality)

**The Problem:** People panic after Googling symptoms, often misinterpreting mild issues as fatal diseases.

**The Solution:** An empathetic symptom checker powered by Gemini that:
- Detects user anxiety via sentiment analysis
- Adjusts tone to be calming and reassuring
- Uses Retrieval-Augmented Generation (RAG) against WHO Clinical Guidelines
- Provides probability-based assessments (e.g., "85% Acid Reflux, 5% Cardiac")

### 💧 Water: HydroGuard (Purity & Flow)

**The Problem:** Citizens lack real-time, accessible data on local water safety.

**The Solution:** An interactive water safety platform featuring:
- Visual map of safe and unsafe water zones
- Citizen Science tool for reporting contamination
- Auto-GPS capture for contamination reports
- Automated ticket generation for local officials

### 🌬️ Air: ClearScript (Communication & Breath)

**The Problem:** Illegible doctor handwriting leads to dangerous medication errors.

**The Solution:** AI-powered prescription reader that:
- Scans and deciphers messy handwritten prescriptions using Gemini Vision
- Extracts raw text and corrects misspelled drug names
- Automatically extracts dosage schedules
- Sets patient medication reminders

### 🌍 Earth: TrueMeds (Stability & Substance)

**The Problem:** Up to 20% of medicines in developing nations are counterfeit.

**The Solution:** Visual counterfeit defense system that:
- Analyzes medicine packaging (fonts, logo alignment)
- Verifies physical pill characteristics (shape, color)
- Cross-references against a "Golden Dataset" of genuine drugs
- Provides instant authenticity verification

### 🌌 Space: LifeLoop (Universal Connection)

**The Problem:** Healthcare is fragmented and excludes non-English speakers.

**The Solution:** Holistic intelligence layer providing:
- Instant translation to local dialects
- Aggregated data from all elements
- Holistic lifestyle recommendations
- Culturally sensitive health guidance

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2+ with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Glassmorphism UI)
- **Animations:** Framer Motion
- **Components:** Custom component architecture

### Backend & AI
- **Runtime:** Node.js
- **AI Engine:** Google Gemini API (Gemini 1.5/2.5 Pro & Flash)
  - Text Processing: Empathetic chat, symptom analysis, translation
  - Multimodal Vision: Prescription OCR, visual counterfeit detection

### Data & Storage
- **Database:** MongoDB / Firebase
- **Storage:** Cloud storage for user profiles and images
- **Maps:** Google Maps API / Mapbox

### Development Tools
- **Build Tool:** Vite
- **Package Manager:** npm/yarn
- **Version Control:** Git

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB URI** or **Firebase Configuration**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aether-health.git
   cd aether-health
   ```

2. **Install dependencies**
   ```bash
   # Install all project dependencies
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Google Gemini API Configuration
   GEMINI_API_KEY=your_google_gemini_api_key_here
   
   # Database Configuration
   DATABASE_URL=your_mongodb_connection_string
   
   # Server Configuration
   PORT=5000
   
   # Optional: Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key
   ```

4. **Start Development Server**
   ```bash
   # Start the application in development mode
   npm run dev
   ```

5. **Build for Production**
   ```bash
   # Create a production build
   npm run build
   
   # Preview production build
   npm run preview
   ```

---

## 📁 Project Structure

```
Health-application/
├── components/          # React components
│   ├── DashboardGrid.tsx
│   ├── ElementSelector.tsx
│   ├── LandingPage.tsx
│   ├── OutputDisplay.tsx
│   ├── SettingsPanel.tsx
│   ├── TrustPanel.tsx
│   └── VoiceInput.tsx
├── services/            # API and external services
│   └── geminiService.ts
├── App.tsx             # Main application component
├── constants.tsx       # Application constants
├── translations.ts     # Internationalization strings
├── types.ts            # TypeScript type definitions
└── vite.config.ts      # Vite configuration
```

---

## 🎨 Core Capabilities

### AI-Powered Features
- **Symptom Analysis:** Context-aware health assessments with anxiety detection
- **Prescription OCR:** Handwritten text recognition and drug name correction
- **Image Verification:** Medicine authentication through visual analysis
- **Natural Language Processing:** Multi-language support and translation
- **Sentiment Analysis:** Adaptive communication based on user emotional state

### User Experience
- **Calm Interface:** Non-clinical, soothing design language
- **Accessibility:** Support for multiple languages and dialects
- **Transparency:** Clear explanation of AI reasoning and data sources
- **Privacy-First:** Secure handling of sensitive health information

---

## 🛡️ Responsible AI & Trust

Aether Health is built with Trust & Safety as core principles:

### ✅ No Hallucinations
Diagnostic advice is grounded in verified WHO datasets and clinical guidelines.

### ✅ Explainability
"Element Tick-Mark Traceability" shows users exactly which data sources contributed to health recommendations.

### ✅ Decision Support, Not Diagnosis
The platform is designed to support and calm users, always recommending professional medical consultation for serious conditions.

### ✅ Data Privacy
All health data is encrypted and stored securely, with user consent and control at the forefront.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `DATABASE_URL` | MongoDB/Firebase connection string | ✅ Yes |
| `PORT` | Server port number | ❌ No (default: 5000) |
| `FIREBASE_API_KEY` | Firebase API key (if using Firebase) | ❌ No |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Debadrit Nag** - *Initial work* - (https://github.com/DebadritNag)

---

## 🙏 Acknowledgments

- Google Gemini API for powerful AI capabilities
- World Health Organization (WHO) for clinical guidelines
- The open-source community for amazing tools and libraries
- Healthcare professionals who provided expert guidance

---

## 📞 Support

For support, questions, or suggestions:
- Open an issue on GitHub
- Email: ritnag2023@gmail.com
- Documentation: [Link to docs]

---

<div align="center">

**Built by Debadrit**

[Report Bug](https://github.com/DebadritNag/aether-health/issues) · [Request Feature](https://github.com/DebadritNag/aether-health/issues)

</div>
