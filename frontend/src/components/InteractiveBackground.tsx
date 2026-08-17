import { useEffect, useState } from 'react';

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#050B14]">
      
      {/* Subtle Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      ></div>

      {/* Animated Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/20 blur-[100px] animate-blob mix-blend-screen"></div>
      
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-600/20 blur-[100px] animate-blob mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      
      <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/15 blur-[120px] animate-blob mix-blend-screen" style={{ animationDelay: '4s' }}></div>

      {/* Mouse Follower Glow */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-[80px] transition-transform duration-300 ease-out mix-blend-screen"
        style={{
          transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)`,
        }}
      ></div>

    </div>
  );
}
