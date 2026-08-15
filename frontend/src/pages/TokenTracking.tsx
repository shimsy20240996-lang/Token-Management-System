import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Loader2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { trackToken } from '../services/api';

const socket = io();

export default function TokenTracking() {
  const { tokenNumber } = useParams<{ tokenNumber: string }>();
  const { t } = useTranslation();
  const ticketRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['track', tokenNumber],
    queryFn: () => trackToken(tokenNumber!),
    refetchInterval: 10000,
  });

  useEffect(() => {
    socket.on('queueUpdated', (_data: any) => {
      refetch();
    });
    
    return () => {
      socket.off('queueUpdated');
    };
  }, [refetch]);

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SmartQueue-Token-${tokenNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error generating ticket image:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

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

  // The URL to return to this specific tracking page
  const trackingUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 pt-12 pb-24">
      <div className="max-w-md w-full">
        
        {/* Ticket Container (This exact div will be converted to an image) */}
        <div 
          ref={ticketRef}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-t-8 border-blue-600 relative"
        >
          {/* Header Pattern */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-blue-600 opacity-10"></div>
          
          <div className="p-8 pb-10 text-center">
            <h1 className="text-xl font-bold text-slate-800 mb-6">{t('Smart Queue Management')}</h1>
            
            <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">{t('Your Token')}</h2>
            <div className="text-6xl font-black text-slate-800 mb-4">{token.tokenNumber}</div>
            
            <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6 bg-blue-50 text-blue-700">
              {token.service.name}
            </div>

            <div className="mb-8 px-6 text-sm text-slate-500">
              Customer: <span className="font-semibold text-slate-700">{token.customer.name}</span>
              <br />
              Issued: {new Date(token.createdAt).toLocaleTimeString()}
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Scan for Live Updates</p>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                <QRCodeSVG value={trackingUrl} size={120} level="H" />
              </div>
            </div>
            
            {/* Dashed line for ticket effect */}
            <div className="relative mt-8 mb-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-slate-200"></div>
              </div>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full"></div>
            </div>
            
            <div className="text-xs text-slate-400 mt-6 font-medium tracking-wide">
              Please present this digital ticket when called.
            </div>
          </div>
        </div>

        {/* Action Buttons (Not included in the downloaded image) */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleDownloadTicket}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download e-Ticket
          </button>
        </div>

        {/* Live Status Alerts */}
        {isServing ? (
          <div className="p-5 bg-green-50 rounded-2xl border border-green-200 text-center shadow-sm animate-pulse">
            <div className="text-green-800 font-black text-2xl mb-1">{t('Your Turn')}!</div>
            <div className="text-green-700 font-medium text-lg">Please proceed to {token.counter?.name}</div>
          </div>
        ) : isCompleted ? (
          <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200 text-center shadow-sm">
            <div className="text-slate-600 font-bold text-xl">Service Completed</div>
            <div className="text-slate-500 mt-1">Thank you for visiting!</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{t('Currently Serving')}</div>
              <div className="text-2xl font-black text-slate-800">{currentlyServing?.tokenNumber || '-'}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{t('People Ahead')}</div>
              <div className="text-2xl font-black text-blue-600">{peopleAhead}</div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
