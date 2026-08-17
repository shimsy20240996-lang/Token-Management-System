import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Briefcase, ChevronRight } from 'lucide-react';
import { getServices, generateToken } from '../services/api';

export default function ServiceSelect() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const handleSelect = async (serviceId: string) => {
    try {
      setSelectedService(serviceId);
      setIsGenerating(true);
      const name = sessionStorage.getItem('customerName') || '';
      const phone = sessionStorage.getItem('customerPhone') || '';
      
      const res = await generateToken({
        name,
        phoneNumber: phone,
        language: i18n.language,
        serviceId
      });

      setTimeout(() => {
        navigate(`/queue/${res.token.tokenNumber}`, { replace: true });
      }, 800);
      
    } catch (error) {
      console.error(error);
      alert('Failed to generate token. Please try again.');
      setIsGenerating(false);
      setSelectedService(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative z-10">
      
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <Loader2 className="w-16 h-16 text-[#06b6d4] animate-spin mb-6" />
          <h2 className="text-2xl font-extrabold text-[#0b1f51] mb-2">{t('Generating your token')}</h2>
          <p className="text-slate-500 font-medium">{t('Please wait a moment...')}</p>
        </div>
      )}

      <div className="w-full max-w-md animate-slide-up mt-10">
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(11,31,81,0.15)] p-8 md:p-10 relative overflow-hidden">

          <div className="relative z-10">
            {!isGenerating && (
              <button 
                onClick={() => navigate(-1)} 
                className="mb-8 flex items-center text-slate-400 hover:text-[#1d4ed8] transition-colors group text-sm font-bold uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('Back')}
              </button>
            )}

            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-[#0b1f51] mb-3 tracking-tight">{t('Select Service')}</h1>
              <p className="text-slate-500 text-[17px]">{t('Choose the service you need today.')}</p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-[20px] border-2 border-slate-100">
                <Loader2 className="w-10 h-10 animate-spin text-[#06b6d4]" />
              </div>
            ) : (
              <div className="space-y-4">
                {services?.map((service: any) => {
                  const isSelected = selectedService === service.id;
                  return (
                    <button
                      key={service.id}
                      disabled={isGenerating}
                      onClick={() => handleSelect(service.id)}
                      className={`w-full p-5 rounded-[16px] transition-all duration-300 text-left flex items-center justify-between group active:scale-[0.98]
                        ${isSelected 
                          ? 'bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4] text-white shadow-[0_8px_20px_rgba(6,182,212,0.3)] scale-[1.02]' 
                          : 'bg-slate-50 border border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-300 text-slate-800'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#1d4ed8] shadow-sm group-hover:bg-blue-50'}`}>
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-[#0b1f51]'}`}>
                            {service.name}
                          </div>
                          <div className={`text-sm font-semibold flex items-center gap-1.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`}></span>
                            {service._count.tokens} {t('Waiting')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
