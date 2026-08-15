import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Loader2 } from 'lucide-react';
import { trackToken } from '../services/api';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000');

export default function TokenTracking() {
  const { tokenNumber } = useParams<{ tokenNumber: string }>();
  const { t } = useTranslation();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['track', tokenNumber],
    queryFn: () => trackToken(tokenNumber!),
    refetchInterval: 10000, // Poll every 10s as backup
  });

  useEffect(() => {
    socket.on('queueUpdated', (_data: any) => {
      // Could check serviceId, but refetching is fine for this size
      refetch();
    });
    
    return () => {
      socket.off('queueUpdated');
    };
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data || !data.token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-2xl font-bold text-slate-800">Token not found</div>
      </div>
    );
  }

  const { token, peopleAhead, currentlyServing } = data;

  const isServing = token.status === 'SERVING';
  const isCompleted = token.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pt-12">
      <div className="max-w-md w-full">
        
        {/* Token Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-t-8 border-blue-600">
          <div className="p-8 text-center">
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">{t('Your Token')}</h2>
            <div className="text-6xl font-black text-slate-800 mb-6">{token.tokenNumber}</div>
            
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6 bg-slate-100 text-slate-600">
              {token.service.name}
            </div>

            {isServing ? (
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="text-green-800 font-bold text-lg mb-1">{t('Your Turn')}</div>
                <div className="text-green-600">Please proceed to {token.counter?.name}</div>
              </div>
            ) : isCompleted ? (
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-slate-600 font-bold text-lg">Completed</div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-amber-800 font-medium">{t('Please Wait')}</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {!isServing && !isCompleted && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
              <div className="text-sm text-slate-500 font-medium mb-1">{t('Currently Serving')}</div>
              <div className="text-2xl font-bold text-slate-800">{currentlyServing?.tokenNumber || '-'}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
              <div className="text-sm text-slate-500 font-medium mb-1">{t('People Ahead')}</div>
              <div className="text-2xl font-bold text-blue-600">{peopleAhead}</div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
