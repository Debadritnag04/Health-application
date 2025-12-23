import React, { useState, useRef } from 'react';
import { ElementType, AnalysisResult, UserProfile } from './types';
import { ELEMENTS } from './constants';
import { TRANSLATIONS } from './translations';
import { generateAetherResponse, routeVoiceIntent, generateVoiceAudio } from './services/geminiService';
import DashboardGrid from './components/DashboardGrid';
import OutputDisplay from './components/OutputDisplay';
import TrustPanel from './components/TrustPanel';
import SettingsPanel from './components/SettingsPanel';
import LandingPage from './components/LandingPage';
import VoiceInput from './components/VoiceInput';

type ViewState = 'LANDING' | 'DASHBOARD' | 'MODULE';

// Audio Decode Helper
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [currentElement, setCurrentElement] = useState<ElementType | null>(null);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    language: 'en',
    tone: 'calm',
    voiceResponse: true,
    accessibility: { largeText: false }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Global Voice State
  const [isRoutingVoice, setIsRoutingVoice] = useState(false);
  
  // TTS State
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Translation Helper
  const t = TRANSLATIONS[userProfile.language];

  const handleElementSelect = (el: ElementType) => {
    setCurrentElement(el);
    setView('MODULE');
    setInputText('');
    setSelectedImage(null);
    setResult(null);
    setError(null);
    stopAudio();
    setAudioBase64(null);
  };

  const handleBack = () => {
    setView('DASHBOARD');
    setCurrentElement(null);
    stopAudio();
    setAudioBase64(null);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setFeedbackMsg(TRANSLATIONS[newProfile.language].updated);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1];
        setSelectedImage(base64Content);
      };
      reader.readAsDataURL(file);
    }
  };

  // Local Voice Input (fills text area)
  const handleLocalVoiceInput = (transcript: string) => {
    setInputText(transcript);
  };

  // Global Voice Input (Routes to element)
  const handleGlobalVoiceInput = async (transcript: string) => {
    if (!transcript) return;
    setIsRoutingVoice(true);
    setFeedbackMsg(t.voice.processing);

    try {
      const routingResult = await routeVoiceIntent(transcript, userProfile);
      
      // Feedback
      setFeedbackMsg(`${t.voice.routed} ${t.elements[routingResult.targetElement].name}`);
      setTimeout(() => setFeedbackMsg(null), 3000);

      // Navigate
      setCurrentElement(routingResult.targetElement);
      setView('MODULE');
      
      // Pre-fill
      setInputText(transcript);
      setResult(null);
      setError(null);
      stopAudio();
      setAudioBase64(null);

    } catch (err) {
      console.error(err);
      setFeedbackMsg(t.voice.error);
    } finally {
      setIsRoutingVoice(false);
    }
  };

  const playAudio = async (base64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const bytes = decode(base64);
      // Decode audio data. 
      // Note: gemini-2.5-flash-preview-tts outputs raw PCM 24kHz mono. 
      
      const buffer = audioContextRef.current.createBuffer(1, bytes.length / 2, 24000);
      const channelData = buffer.getChannelData(0);
      const dataInt16 = new Int16Array(bytes.buffer);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      
      sourceRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio playback error", e);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleClear = () => {
    setInputText('');
    setSelectedImage(null);
    setResult(null);
    setError(null);
    stopAudio();
    setAudioBase64(null);
  };

  const handleAction = async () => {
    if (!currentElement) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    stopAudio();
    setAudioBase64(null);

    try {
      const response = await generateAetherResponse(
        currentElement, 
        inputText, 
        userProfile,
        selectedImage || undefined
      );
      setResult(response);

      // Trigger Voice Response if enabled
      if (userProfile.voiceResponse) {
        // Construct a concise summary to speak
        let textToSpeak = response.reassuranceLine;
        if (response.safetyAdvice) textToSpeak += ". " + response.safetyAdvice;
        if (response.whatThisMeans) textToSpeak = response.whatThisMeans + ". " + textToSpeak;
        
        // Ensure not too long
        if (textToSpeak.length > 300) textToSpeak = textToSpeak.substring(0, 300) + "...";

        // Generate Audio
        const audio = await generateVoiceAudio(textToSpeak, currentElement);
        if (audio) {
          setAudioBase64(audio);
          playAudio(audio);
        }
      }

    } catch (err) {
      setError("Aether could not complete the analysis. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentConfig = currentElement ? ELEMENTS[currentElement] : null;
  const currentLoc = currentConfig ? t.elements[currentConfig.id] : null;

  // Render Landing Page
  if (view === 'LANDING') {
    return <LandingPage onEnter={() => setView('DASHBOARD')} t={t} />;
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-white/20 ${userProfile.accessibility.largeText ? 'text-lg' : ''} animate-fade-in`}>
      
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
               <span className="text-white font-bold text-lg">Ah</span>
             </div>
             <span className="text-xl font-display font-semibold text-white tracking-tight">{t.appTitle}</span>
          </div>
          <div className="flex items-center gap-4">
             {feedbackMsg && (
               <span className="text-emerald-400 text-sm animate-fade-in mr-2 hidden md:block">{feedbackMsg}</span>
             )}
             
             {/* Global Voice Button (Visible on Dashboard) */}
             {view === 'DASHBOARD' && (
               <div className="mr-2">
                  <VoiceInput 
                    onTranscript={handleGlobalVoiceInput} 
                    userProfile={userProfile} 
                    t={t}
                    compact={true}
                  />
               </div>
             )}

             <button 
               onClick={() => setShowSettings(true)}
               className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
             >
               <span className="sr-only">Settings</span>
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
               {userProfile.language.toUpperCase()}
             </div>
          </div>
        </div>
      </nav>

      {showSettings && (
        <SettingsPanel 
          profile={userProfile} 
          onUpdate={handleUpdateProfile} 
          onClose={() => setShowSettings(false)} 
          t={t}
        />
      )}

      <main className="max-w-7xl mx-auto px-6 py-12 relative">
        
        {/* VIEW: DASHBOARD */}
        {view === 'DASHBOARD' && (
          <div className="animate-fade-in">
            <header className="text-center mb-16 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
              <h1 className="text-5xl md:text-6xl font-display font-medium text-white mb-4 tracking-tight text-glow">
                {t.dashboardTitle}
              </h1>
              <p className="text-xl text-gray-400 font-light">
                {t.dashboardSubtitle}
              </p>
            </header>
            
            <div className="flex justify-center mb-12">
               {isRoutingVoice && (
                 <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full animate-pulse border border-white/20">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span className="text-sm font-semibold text-white">{t.voice.speakNow}</span>
                 </div>
               )}
            </div>

            <DashboardGrid onSelect={handleElementSelect} t={t} />
            
            <footer className="mt-24 text-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6"></div>
              <p className="text-sm text-gray-500 font-display tracking-widest uppercase opacity-70">
                "{t.footer}"
              </p>
            </footer>
          </div>
        )}

        {/* VIEW: MODULE */}
        {view === 'MODULE' && currentConfig && currentLoc && (
          <div className="animate-fade-in">
            
            {/* Module Header */}
            <div className="flex items-center gap-4 mb-10">
              <button 
                onClick={handleBack}
                className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span className="text-sm font-medium">{t.backToDashboard}</span>
              </button>
              <div className="h-6 w-px bg-white/10 mx-2"></div>
              <h2 className={`text-2xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r ${currentConfig.gradientFrom.replace('/20','')} ${currentConfig.gradientTo.replace('/20','')}`}>
                {currentLoc.name}
              </h2>
              
              {/* TTS Controls */}
              {audioBase64 && (
                <div className="ml-auto flex items-center gap-2">
                   {isPlaying ? (
                     <button onClick={stopAudio} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium hover:bg-red-500/30 transition-colors">
                       <span className="animate-pulse">●</span> {t.voice.mute}
                     </button>
                   ) : (
                     <button onClick={() => playAudio(audioBase64)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                       {t.voice.replay}
                     </button>
                   )}
                </div>
              )}
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: Input Column (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                 <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-6">
                       <div className={`p-2 rounded-lg bg-gradient-to-br ${currentConfig.gradientFrom} ${currentConfig.gradientTo} text-white`}>
                         <currentConfig.icon className="w-5 h-5" />
                       </div>
                       <div className="text-sm font-bold text-gray-300 uppercase tracking-wider">{t.inputLabel}</div>
                    </div>

                    <div className="space-y-6">
                      {currentConfig.inputType === 'text' && (
                        <div className="space-y-3">
                          <textarea
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all resize-none h-48 text-sm leading-relaxed"
                            placeholder={currentLoc.placeholder}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          />
                          {/* Local Voice Input */}
                          <VoiceInput 
                            onTranscript={handleLocalVoiceInput} 
                            userProfile={userProfile} 
                            t={t}
                          />
                        </div>
                      )}

                      {currentConfig.inputType === 'image' && (
                        <div className="relative group">
                          <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              className="hidden" 
                              id="image-upload" 
                            />
                          <label htmlFor="image-upload" className="block cursor-pointer">
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
                                {selectedImage ? (
                                  <div className="relative rounded-lg overflow-hidden h-32 w-full">
                                     <img src={`data:image/png;base64,${selectedImage}`} alt="Upload" className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                       <span className="text-xs text-white">{t.changeImage}</span>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <svg className="w-8 h-8 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-sm text-gray-400">{t.uploadPhoto}</span>
                                  </div>
                                )}
                            </div>
                          </label>
                        </div>
                      )}

                      {currentConfig.inputType === 'mock_action' && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                           <p className="text-sm text-gray-400">{t.initSim}</p>
                        </div>
                      )}

                      <div className="flex items-stretch gap-3">
                         {currentConfig.inputType !== 'mock_action' && (
                           <button
                             onClick={handleClear}
                             disabled={loading || (!inputText && !selectedImage)}
                             className="px-4 rounded-xl font-bold text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                             title="Clear Input"
                           >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         )}

                         <button
                           onClick={handleAction}
                           disabled={loading || (currentConfig.inputType === 'text' && !inputText) || (currentConfig.inputType === 'image' && !selectedImage)}
                           className={`
                             flex-1 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                             bg-gradient-to-r ${currentConfig.gradientFrom.replace('/20','')} ${currentConfig.gradientTo.replace('/20','')}
                             hover:shadow-xl hover:brightness-110
                           `}
                         >
                           {loading ? (
                             <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>{t.thinking}</span>
                             </div>
                           ) : (
                             <span>{t.analyze}</span>
                           )}
                         </button>
                      </div>

                      {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                    </div>
                 </div>
              </div>

              {/* CENTER: Output Column (6 cols) */}
              <div className="lg:col-span-6">
                {result ? (
                  <OutputDisplay element={currentElement} result={result} t={t} />
                ) : (
                  <div className="h-full min-h-[400px] glass-card rounded-3xl flex flex-col items-center justify-center text-center p-8 opacity-50 border-dashed border-2 border-white/5">
                     <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse-slow">
                        <currentConfig.icon className="w-8 h-8 text-gray-500" />
                     </div>
                     <h3 className="text-xl text-gray-300 font-display mb-2">{t.readyForAnalysis}</h3>
                     <p className="text-gray-500 max-w-xs mx-auto">
                       {t.readyDesc}
                     </p>
                  </div>
                )}
              </div>

              {/* RIGHT: Trust Column (3 cols) */}
              <div className="lg:col-span-3">
                 <TrustPanel 
                   emotionalTone={result?.emotionalState} 
                   reasoning={result?.reasoningSummary}
                   t={t}
                 />
                 
                 {/* Decorative */}
                 {!result && (
                   <div className="mt-8 p-6 text-center opacity-30">
                     <div className="w-16 h-1 bg-white/20 mx-auto mb-4"></div>
                     <p className="text-xs font-serif italic text-gray-400">
                       Aether Health operates on a responsible AI framework prioritizing safety and clarity.
                     </p>
                   </div>
                 )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;