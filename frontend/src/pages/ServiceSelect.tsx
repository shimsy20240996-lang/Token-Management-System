import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getServices, generateToken } from '../services/api';

export default function ServiceSelect() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const handleSelect = async (serviceId: string) => {
    try {
      setIsGenerating(true);
      const name = sessionStorage.getItem('customerName') || '';
      const phone = sessionStorage.getItem('customerPhone') || '';
      
      const res = await generateToken({
        name,
        phoneNumber: phone,
        language: i18n.language,
        serviceId
      });

      navigate(`/queue/${res.token.tokenNumber}`, { replace: true });
    } catch (error) {
      console.error(error);
      alert('Failed to generate token. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5 mr-1" />
          {t('Back')}
        </button>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">{t('Select Service')}</h2>

        {isLoading ? (
          <div className="flex justify-center p-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {services?.map((service: any) => (
              <button
                key={service.id}
                disabled={isGenerating}
                onClick={() => handleSelect(service.id)}
                className="w-full py-5 px-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-semibold text-lg text-slate-800 mb-1">{service.name}</div>
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <span>{t('People Ahead')}:</span>
                  <span className="font-bold text-slate-700">{service._count.tokens}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
