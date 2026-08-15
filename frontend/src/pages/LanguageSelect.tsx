import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (lang: string) => {
    setSelected(lang);
    setTimeout(() => {
      i18n.changeLanguage(lang);
      navigate('/customer');
    }, 350);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        
        <div className="bg-[#17233A] rounded-[32px] shadow-[0_20px_50px_rgba(23,35,58,0.2)] p-8 md:p-12 relative overflow-hidden border border-[#1e2f4c]">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <p className="text-[#2563EB] font-bold tracking-widest uppercase text-sm mb-3">{t('Smart Queue')}</p>
              <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">{t('Welcome')}</h1>
              <p className="text-[#94a3b8] text-lg">{t('Select your preferred language')}</p>
            </div>
            
            <div className="space-y-4">
              {languages.map((lang) => {
                const isSelected = selected === lang.code;
                return (
                  <button 
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full p-6 rounded-[20px] transition-all duration-300 flex items-center justify-between group active:scale-[0.98]
                      ${isSelected 
                        ? 'bg-[#2563EB] border-2 border-blue-400 shadow-[0_8px_20px_rgba(37,99,235,0.4)] scale-[1.02]' 
                        : 'bg-[#1e2f4c] border border-[#2c3e5e] hover:-translate-y-1 hover:shadow-lg hover:border-blue-400/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                      <span className={`text-xl font-semibold text-white`}>
                        {lang.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-white text-[#2563EB] flex items-center justify-center animate-scale-up">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
