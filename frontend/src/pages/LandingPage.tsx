import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative z-10">
      <div className="max-w-md w-full text-center animate-slide-up mt-10">
        
        {/* Top greeting above card */}
        <div className="mb-6 text-white text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md mb-4 border border-white/20">
            <Sparkles className="w-4 h-4" />
            {t('Premium Service')}
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(11,31,81,0.15)] p-10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-[20px] flex items-center justify-center mb-8 shadow-inner">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1d4ed8] to-[#06b6d4] rounded-[14px] text-white flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-[#0b1f51] mb-3 tracking-tight">
              {t('Smart Queue')}
            </h1>
            <p className="text-slate-500 mb-10 text-[17px] font-medium leading-relaxed">
              {t('Skip the physical line and save your time.')}
            </p>
            
            <button
              onClick={() => navigate('/language')}
              className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4] hover:opacity-90 active:scale-[0.98] text-white font-bold py-4 rounded-[16px] text-lg transition-all flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(6,182,212,0.3)] group"
            >
              {t('GET YOUR TOKEN')}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
