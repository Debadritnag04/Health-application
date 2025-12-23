import React from 'react';
import { UserProfile, Language, Tone } from '../types';

interface SettingsPanelProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onClose: () => void;
  t: any; // Translations
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ profile, onUpdate, onClose, t }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' }
  ];

  const tones: { code: Tone; label: string }[] = [
    { code: 'calm', label: 'Calm' },
    { code: 'neutral', label: 'Neutral' },
    { code: 'supportive', label: 'Supportive' }
  ];

  const handleLanguageChange = (code: Language) => {
    onUpdate({ ...profile, language: code });
  };

  const handleToneChange = (code: Tone) => {
    onUpdate({ ...profile, tone: code });
  };

  const toggleVoice = () => {
    onUpdate({ ...profile, voiceResponse: !profile.voiceResponse });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#151A25] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-display font-semibold text-white">{t.preferences}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Language */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.language}</label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    profile.language === lang.code
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.tone}</label>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              {tones.map((tone) => (
                <button
                  key={tone.code}
                  onClick={() => handleToneChange(tone.code)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    profile.tone === tone.code
                      ? 'bg-gray-700 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Response */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.voiceResponse}</label>
            <button
              onClick={toggleVoice}
              className={`w-full py-3 rounded-xl flex items-center justify-between px-6 transition-all ${
                profile.voiceResponse
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="font-medium">{profile.voiceResponse ? 'Enabled' : 'Disabled'}</span>
              <div className={`w-10 h-6 rounded-full p-1 transition-colors ${profile.voiceResponse ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${profile.voiceResponse ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

        </div>

        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;