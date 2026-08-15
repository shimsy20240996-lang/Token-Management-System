import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LanguageSelect() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    navigate('/customer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">{t('Select Your Language')}</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => handleSelect('en')}
            className="w-full py-5 px-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xl font-medium text-slate-700 transition-all text-left flex items-center justify-between"
          >
            English
            <span className="text-2xl">🇬🇧</span>
          </button>
          
          <button 
            onClick={() => handleSelect('si')}
            className="w-full py-5 px-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xl font-medium text-slate-700 transition-all text-left flex items-center justify-between"
          >
            සිංහල
            <span className="text-2xl">🇱🇰</span>
          </button>
          
          <button 
            onClick={() => handleSelect('ta')}
            className="w-full py-5 px-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xl font-medium text-slate-700 transition-all text-left flex items-center justify-between"
          >
            தமிழ்
            <span className="text-2xl">🇱🇰</span>
          </button>
        </div>
      </div>
    </div>
  );
}
