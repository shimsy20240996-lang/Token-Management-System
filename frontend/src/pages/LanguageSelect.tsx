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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative z-10">
      <div className="w-full max-w-md animate-slide-up mt-10">
        
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(11,31,81,0.15)] p-8 md:p-10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-[#0b1f51] mb-3 tracking-tight">{t('Welcome')}</h1>
              <p className="text-slate-500 text-[17px]">{t('Select your preferred language')}</p>
            </div>
            
            <div className="space-y-4">
              {languages.map((lang) => {
                const isSelected = selected === lang.code;
                return (
                  <button 
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full p-5 rounded-[16px] transition-all duration-300 flex items-center justify-between group active:scale-[0.98]
                      ${isSelected 
                        ? 'bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4] text-white shadow-[0_8px_20px_rgba(6,182,212,0.3)] scale-[1.02]' 
                        : 'bg-slate-50 border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-300 text-slate-800'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                      <span className={`text-xl font-bold`}>
                        {lang.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-white text-[#1d4ed8] flex items-center justify-center animate-scale-up shadow-sm">
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
