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
        backgroundColor: 'transparent' // Let the ticket design be standalone
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
        <Loader2 className="w-12 h-12 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (!data || !data.token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-[#17233A]">Token not found</div>
      </div>
    );
  }

  const { token, peopleAhead, currentlyServing } = data;
  const isServing = token.status === 'SERVING';
  const isCompleted = token.status === 'COMPLETED';
  const trackingUrl = window.location.href;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-6 pt-8 pb-24 animate-fade-in">
      <div className="w-full max-w-[420px] mx-auto animate-slide-up">
        
        {/* Main Ticket */}
        <div 
          ref={ticketRef}
          className="bg-[#17233A] rounded-[24px] shadow-[0_20px_50px_rgba(23,35,58,0.2)] overflow-hidden relative mb-6 border border-[#1e2f4c]"
        >
          {/* Top Blue Accent */}
          <div className="h-2 w-full bg-[#2563EB]"></div>
          
          <div className="p-8 pb-10 text-center relative">
            
            {/* Header */}
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase mb-10">
              {t('Smart Queue')}
            </h1>
            
            <p className="text-xs font-bold tracking-widest text-[#94a3b8] uppercase mb-2">
              {t('Your Token')}
            </p>
            
            {/* Massive Token Number */}
            <div className="text-[clamp(4rem,12vw,6rem)] leading-none font-extrabold text-white mb-4 tracking-tighter" style={{ textShadow: '0 4px 20px rgba(37,99,235,0.4)' }}>
              {token.tokenNumber}
            </div>
            
            <div className="inline-block px-5 py-2 rounded-full text-sm font-bold bg-[#2563EB]/20 text-[#60a5fa] mb-8">
              {token.service.name}
            </div>

            <div className="space-y-1 mb-8 text-sm">
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Customer:</span>
                <span className="font-bold text-white">{token.customer.name}</span>
              </div>
              <div className="flex justify-between items-center text-[#94a3b8]">
                <span>Issued:</span>
                <span className="font-bold text-white">
                  {new Date(token.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Divider with ticket cutouts */}
            <div className="relative mt-8 mb-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-[3px] border-dashed border-[#1e2f4c]"></div>
              </div>
              {/* Left Cutout - Should match global background #F5F8FC visually if possible, but actually transparent or background color */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F5F8FC] rounded-full shadow-inner border-r border-[#1e2f4c]"></div>
              {/* Right Cutout */}
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F5F8FC] rounded-full shadow-inner border-l border-[#1e2f4c]"></div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-[#1e2f4c]">
              <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-[0.15em] mb-4">
                Scan to track your token
              </p>
              <div className="bg-white p-4 rounded-[16px] shadow-sm mb-4">
                <QRCodeCanvas value={trackingUrl} size={140} level="H" fgColor="#17233A" />
              </div>
              <p className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-wider">
                Live queue updates<br/>No app required
              </p>
            </div>
            
            <p className="text-xs text-[#94a3b8] mt-8 font-semibold uppercase tracking-widest opacity-60">
              Please present when called.
            </p>
          </div>
        </div>

        {/* Live Status Region */}
        <div className="space-y-4 mb-8">
          {isServing ? (
            <div className="bg-[#16A34A] rounded-[20px] p-6 text-center text-white shadow-[0_8px_30px_rgba(22,163,74,0.3)] animate-pulse">
              <div className="text-sm font-bold uppercase tracking-widest mb-1">Live Now</div>
              <div className="text-3xl font-black mb-2">It's your turn!</div>
              <div className="font-medium opacity-90">Please proceed to {token.counter?.name}</div>
            </div>
          ) : isCompleted ? (
            <div className="bg-[#17233A] rounded-[20px] p-6 text-center shadow-sm border border-[#1e2f4c]">
              <div className="text-white font-bold text-xl">Service Completed</div>
              <div className="text-[#94a3b8] mt-1 text-sm">Thank you for visiting!</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Currently Serving */}
              <div className="bg-[#17233A] rounded-[20px] p-5 shadow-[0_20px_50px_rgba(23,35,58,0.2)] text-center relative overflow-hidden border border-[#1e2f4c]">
                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></span>
                  Currently Serving
                </div>
                {currentlyServing ? (
                  <div className="text-2xl font-black text-white">{currentlyServing.tokenNumber}</div>
                ) : (
                  <div className="text-sm font-semibold text-[#94a3b8] py-1">Waiting for service</div>
                )}
              </div>
              
              {/* People Ahead */}
              <div className="bg-[#17233A] rounded-[20px] p-5 shadow-[0_20px_50px_rgba(23,35,58,0.2)] text-center border border-[#1e2f4c]">
                <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                  People Ahead
                </div>
                {peopleAhead === 0 ? (
                  <div className="text-lg font-black text-[#16A34A] uppercase py-0.5">You're Next!</div>
                ) : (
                  <div className="text-2xl font-black text-[#60a5fa]">{peopleAhead}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadTicket}
          disabled={downloadState !== 'idle'}
          className={`w-full font-bold py-5 rounded-[20px] text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_25px_-5px_rgba(37,99,235,0.4)]
            ${downloadState === 'success' 
              ? 'bg-[#16A34A] text-white scale-[0.98]' 
              : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-1 active:scale-[0.98] text-white'
            }`}
        >
          {downloadState === 'downloading' ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : downloadState === 'success' ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              TICKET DOWNLOADED
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
