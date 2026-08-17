import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Briefcase, CheckCircle2 } from 'lucide-react';
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

      // Small delay for smooth transition experience
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative">
      
      {/* Full screen generating overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-[#050B14]/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <Loader2 className="w-16 h-16 text-[#2563EB] animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('Generating your token')}</h2>
          <p className="text-[#94a3b8]">{t('Please wait a moment...')}</p>
        </div>
      )}

      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-[#17233A] rounded-[32px] shadow-[0_20px_50px_rgba(23,35,58,0.2)] p-8 md:p-12 relative overflow-hidden border border-[#1e2f4c]">
          {/* Subtle Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="relative z-10">
            {!isGenerating && (
              <button 
                onClick={() => navigate(-1)} 
                className="mb-8 flex items-center text-[#94a3b8] hover:text-white transition-colors group text-sm font-semibold uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('Back')}
              </button>
            )}

            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">{t('Select Service')}</h1>
              <p className="text-[#94a3b8]">{t('Choose the service you need today.')}</p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#1e2f4c] rounded-[24px] shadow-sm border border-[#2c3e5e]">
                <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
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
                      className={`w-full p-6 rounded-[20px] transition-all duration-300 text-left flex items-center justify-between group active:scale-[0.98]
                        ${isSelected 
                          ? 'bg-[#2563EB] border-2 border-blue-400 shadow-[0_8px_20px_rgba(37,99,235,0.4)] scale-[1.02]' 
                          : 'bg-[#1e2f4c] border border-[#2c3e5e] hover:-translate-y-1 hover:shadow-lg hover:border-blue-400/50'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full transition-colors ${isSelected ? 'bg-white text-[#2563EB]' : 'bg-[#17233A] text-slate-300 group-hover:bg-[#2563EB]/20 group-hover:text-blue-400'}`}>
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {service.name}
                          </div>
                          <div className={`text-sm font-medium flex items-center gap-1.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-500'}`}></span>
                            {service._count.tokens} {t('Waiting')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="w-7 h-7 text-white animate-scale-up" />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-[#475569] group-hover:border-blue-400 transition-colors"></div>
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
