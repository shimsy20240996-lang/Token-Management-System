import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full text-center animate-slide-up">
        
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-12 relative overflow-hidden border border-slate-100/50">
          {/* Subtle Top Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="mx-auto w-24 h-24 bg-[#F5F8FC] rounded-[24px] flex items-center justify-center mb-10 shadow-inner">
              <div className="w-16 h-16 bg-[#2563EB] rounded-[16px] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-[#17233A] mb-4 tracking-tight">
              {t('Smart Queue')}
            </h1>
            <p className="text-[#64748B] mb-12 text-lg font-medium">
              {t('Skip the physical line and save your time.')}
            </p>
            
            <button
              onClick={() => navigate('/language')}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-bold py-5 rounded-[20px] text-lg transition-all flex items-center justify-center gap-3 shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)] group"
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
