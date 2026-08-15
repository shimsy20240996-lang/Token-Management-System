import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000');

export default function QueueDisplay() {
  const [calledToken, setCalledToken] = useState<any>(null);

  const fetchQueue = async () => {
    // In a real scenario, this endpoint should fetch all active queues
    // For now, we'll listen to socket events to update display
  };

  useEffect(() => {
    fetchQueue();
    
    socket.on('tokenCalled', (token: any) => {
      setCalledToken(token);
      // Speak the token number (Web Speech API)
      const utterance = new SpeechSynthesisUtterance(`Token ${token.tokenNumber.replace('-', ' ')} please proceed to ${token.counter.name}`);
      window.speechSynthesis.speak(utterance);
    });

    return () => {
      socket.off('tokenCalled');
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-white">Smart Queue</h1>
        <div className="text-2xl font-medium text-slate-400">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-8">
        
        {/* Main Display - Now Serving */}
        <div className="col-span-8 flex flex-col">
          <div className="bg-slate-800 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center border-4 border-blue-600 shadow-2xl relative overflow-hidden">
            {calledToken ? (
              <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center">
                <div className="text-4xl font-bold tracking-widest text-slate-400 uppercase mb-8">NOW SERVING</div>
                <div className="text-[12rem] leading-none font-black text-white mb-8 drop-shadow-2xl">{calledToken.tokenNumber}</div>
                <div className="text-6xl font-bold text-yellow-400 uppercase">{calledToken.counter?.name}</div>
                <div className="mt-8 text-2xl text-slate-300">{calledToken.service?.name}</div>
              </div>
            ) : (
              <div className="text-4xl font-medium text-slate-500">Waiting for next token...</div>
            )}
          </div>
        </div>

        {/* Sidebar - Next up (Placeholder design) */}
        <div className="col-span-4 bg-slate-800 rounded-3xl p-8 flex flex-col">
          <h2 className="text-3xl font-bold text-slate-300 mb-8 border-b border-slate-700 pb-4">Next in Line</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-xl text-slate-500 text-center">
              Please wait for your token to be called.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
