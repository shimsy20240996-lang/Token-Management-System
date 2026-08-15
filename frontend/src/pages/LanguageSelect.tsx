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
        
        <div className="text-center mb-12">
          <p className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">{t('Smart Queue')}</p>
          <h1 className="text-4xl font-extrabold text-[#17233A] mb-4 tracking-tight">{t('Welcome')}</h1>
          <p className="text-[#64748B] text-lg">{t('Select your preferred language')}</p>
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
                    ? 'bg-blue-50 border-2 border-blue-600 shadow-md scale-[1.02]' 
                    : 'bg-white border border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg hover:border-blue-200'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                  <span className={`text-xl font-semibold ${isSelected ? 'text-blue-700' : 'text-[#17233A]'}`}>
                    {lang.label}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-scale-up">
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
  );
}
