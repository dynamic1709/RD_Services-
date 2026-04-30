import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('idle'), 300);
    const t2 = setTimeout(() => setPhase('exit'), 2400);
    const t3 = setTimeout(onComplete, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'hsl(220, 17%, 5%)' }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute animate-float"
          style={{
            top: '-5%', left: '-10%',
            width: '70%', height: '70%',
            background: 'radial-gradient(circle, hsl(25, 100%, 54%, 0.14) 0%, transparent 65%)',
            filter: 'blur(50px)',
            animationDuration: '7s',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-10%', right: '-10%',
            width: '65%', height: '65%',
            background: 'radial-gradient(circle, hsl(262, 80%, 60%, 0.08) 0%, transparent 65%)',
            filter: 'blur(60px)',
            animation: 'float 9s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Logo group */}
      <div
        className={`relative z-10 flex flex-col items-center gap-7 transition-all duration-700 ${
          phase === 'enter' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {/* Icon */}
        <div className="relative">
          {/* Ping rings */}
          <div
            className="absolute inset-0 rounded-[28px] animate-ping-slow"
            style={{ background: 'hsl(25, 100%, 54%, 0.2)' }}
          />
          <div
            className="absolute -inset-3 rounded-[34px] animate-pulse"
            style={{ background: 'hsl(25, 100%, 54%, 0.1)', filter: 'blur(12px)' }}
          />
          <div
            className="relative w-28 h-28 rounded-[28px] flex items-center justify-center animate-pulse-glow"
            style={{
              background: 'linear-gradient(145deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
              boxShadow: '0 20px 60px hsl(25, 100%, 54%, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <Zap className="w-14 h-14 text-white" strokeWidth={2.5} fill="white" fillOpacity={0.9} />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h1
            className="text-5xl font-black tracking-tight mb-2 animate-slide-up"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 65%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Swift
            </span>
            <span className="text-white">Ship</span>
          </h1>
          <p
            className="text-base font-medium tracking-widest uppercase animate-slide-up stagger-1"
            style={{ color: 'hsl(215, 20%, 55%)', letterSpacing: '0.18em' }}
          >
            Deliver. Track. Repeat.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2.5 animate-slide-up stagger-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 7, height: 7,
                background: i === 0
                  ? 'hsl(25, 100%, 54%)'
                  : 'hsl(215, 20%, 30%)',
                animation: `bounce-subtle 1.4s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-10 text-center animate-fade-in stagger-3">
        <p style={{ color: 'hsl(215, 20%, 35%)', fontSize: 12, letterSpacing: '0.08em' }}>
          v2.0 · Made in India 🇮🇳
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
