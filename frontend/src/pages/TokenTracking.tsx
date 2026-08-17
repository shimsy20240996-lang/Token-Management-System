import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import { trackToken } from '../services/api';

const socket = io();

export default function TokenTracking() {
  const { tokenNumber } = useParams<{ tokenNumber: string }>();
  const { t } = useTranslation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'success'>('idle');

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
    if (!ticketRef.current || downloadState === 'downloading') return;
    
    setDownloadState('downloading');
    
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent'
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `SmartQueue-Token-${tokenNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2000);
      
    } catch (error: any) {
      console.error('Error generating ticket image:', error);
      alert('Failed to download ticket: ' + (error.message || error));
      setDownloadState('idle');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#06b6d4]" />
      </div>
    );
  }

  if (!data || !data.token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-[#0b1f51]">Token not found</div>
      </div>
    );
  }

  const { token, peopleAhead, currentlyServing } = data;
  const isServing = token.status === 'SERVING';
  const isCompleted = token.status === 'COMPLETED';
  const trackingUrl = window.location.href;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-6 pt-12 pb-24 animate-fade-in relative z-10">
      <div className="w-full max-w-[420px] mx-auto animate-slide-up">
        
        {/* Main Ticket */}
        <div 
          ref={ticketRef}
          className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(11,31,81,0.15)] overflow-hidden relative mb-6"
        >
          {/* Top Telecom Accent */}
          <div className="h-3 w-full bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4]"></div>
          
          <div className="p-8 pb-10 text-center relative">
            
            <h1 className="text-xl font-bold tracking-[0.2em] text-[#0b1f51] uppercase mb-8">
              {t('Smart Queue')}
            </h1>
            
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">
              {t('Your Token')}
            </p>
            
            {/* Massive Token Number */}
            <div className="text-[clamp(4rem,12vw,6rem)] leading-none font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#0b1f51] to-[#1d4ed8] mb-4 tracking-tighter pb-2">
              {token.tokenNumber}
            </div>
            
            <div className="inline-block px-5 py-2 rounded-full text-sm font-bold bg-blue-50 text-[#1d4ed8] mb-8">
              {token.service.name}
            </div>

            <div className="space-y-2 mb-8 text-sm">
              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">Customer:</span>
                <span className="font-bold text-[#0b1f51]">{token.customer.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">Issued:</span>
                <span className="font-bold text-[#0b1f51]">
                  {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Divider with ticket cutouts */}
            <div className="relative mt-8 mb-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-2 border-dashed border-slate-200"></div>
              </div>
              {/* Left Cutout */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8fafc] rounded-full shadow-inner border-r border-slate-200"></div>
              {/* Right Cutout */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8fafc] rounded-full shadow-inner border-l border-slate-200"></div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em] mb-4">
                Scan to track your token
              </p>
              <div className="bg-white p-4 rounded-[16px] shadow-sm mb-4 border border-slate-100">
                <QRCodeCanvas value={trackingUrl} size={140} level="H" fgColor="#0b1f51" />
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Live queue updates<br/>No app required
              </p>
            </div>
            
            <p className="text-xs text-slate-400 mt-8 font-bold uppercase tracking-widest opacity-80">
              Please present when called.
            </p>
          </div>
        </div>

        {/* Live Status Region */}
        <div className="space-y-4 mb-8">
          {isServing ? (
            <div className="bg-gradient-to-r from-green-500 to-emerald-400 rounded-[24px] p-6 text-center text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] animate-pulse">
              <div className="text-sm font-bold uppercase tracking-widest mb-1 shadow-black/10">Live Now</div>
              <div className="text-3xl font-black mb-2 drop-shadow-sm">It's your turn!</div>
              <div className="font-bold opacity-90">Please proceed to {token.counter?.name}</div>
            </div>
          ) : isCompleted ? (
            <div className="bg-white rounded-[24px] p-6 text-center shadow-md border border-slate-100">
              <div className="text-[#0b1f51] font-bold text-xl">Service Completed</div>
              <div className="text-slate-500 mt-1 text-sm font-medium">Thank you for visiting!</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Currently Serving */}
              <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(11,31,81,0.08)] text-center relative overflow-hidden border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  Currently Serving
                </div>
                {currentlyServing ? (
                  <div className="text-3xl font-black text-[#0b1f51]">{currentlyServing.tokenNumber}</div>
                ) : (
                  <div className="text-sm font-bold text-slate-400 py-2">Waiting</div>
                )}
              </div>
              
              {/* People Ahead */}
              <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(11,31,81,0.08)] text-center border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  People Ahead
                </div>
                {peopleAhead === 0 ? (
                  <div className="text-lg font-black text-green-500 uppercase py-1">You're Next!</div>
                ) : (
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4]">
                    {peopleAhead}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadTicket}
          disabled={downloadState !== 'idle'}
          className={`w-full font-bold py-5 rounded-[20px] text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(11,31,81,0.2)]
            ${downloadState === 'success' 
              ? 'bg-green-500 text-white scale-[0.98]' 
              : 'bg-[#0b1f51] hover:bg-[#1e2f4c] hover:-translate-y-1 active:scale-[0.98] text-white'
            }`}
        >
          {downloadState === 'downloading' ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : downloadState === 'success' ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              TICKET SAVED
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              DOWNLOAD E-TICKET
            </>
          )}
        </button>

      </div>
    </div>
  );
}
