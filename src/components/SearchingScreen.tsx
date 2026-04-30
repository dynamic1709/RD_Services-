import { useEffect, useState } from 'react';
import { MapPin, Cpu } from 'lucide-react';

interface SearchingScreenProps {
  onComplete: () => void;
}

const steps = [
  'Locating courier offices…',
  'Checking availability…',
  'Comparing prices…',
  'Almost done…',
];

const findings = ['SpeedX', 'BlueDart', 'DTDC', 'FedEx'];

const SearchingScreen = ({ onComplete }: SearchingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 1.8;
      });
    }, 55);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const s = setInterval(() => setStepIndex((p) => Math.min(p + 1, steps.length - 1)), 900);
    const f = setInterval(() => setFoundCount((p) => Math.min(p + 1, findings.length)), 700);
    return () => { clearInterval(s); clearInterval(f); };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'hsl(220, 17%, 5%)' }}
    >
      {/* Background ambient */}
      <div
        className="absolute rounded-full pointer-events-none animate-pulse"
        style={{
          width: 360, height: 360,
          background: 'radial-gradient(circle, hsl(25, 100%, 54%, 0.08) 0%, transparent 65%)',
          filter: 'blur(30px)',
        }}
      />

      {/* === RADAR ANIMATION === */}
      <div className="relative w-52 h-52 mb-10">
        {/* Outer rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: `${i * 18}px`,
              border: `1px solid hsl(25, 100%, 54%, ${0.08 + i * 0.04})`,
              animation: `ping-slow ${2 + i * 0.5}s cubic-bezier(0,0,0.2,1) ${i * 0.3}s infinite`,
            }}
          />
        ))}

        {/* Sweep line */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              hsl(25, 100%, 54%, 0.12) 60deg,
              transparent 90deg
            )`,
            animation: 'spin-slow 2.5s linear infinite',
          }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
              boxShadow: '0 8px 40px hsl(25, 100%, 54%, 0.5)',
            }}
          >
            <MapPin className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Blip dots */}
        {findings.slice(0, foundCount).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-scale-in"
            style={{
              background: 'hsl(25, 100%, 54%)',
              boxShadow: '0 0 8px hsl(25, 100%, 54%, 0.8)',
              top: `${22 + [30, 65, 15, 50][i]}%`,
              left: `${22 + [20, 55, 65, 10][i]}%`,
            }}
          />
        ))}
      </div>

      {/* === TEXT === */}
      <div className="text-center mb-8 space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Cpu className="w-4 h-4 animate-spin-slow" style={{ color: 'hsl(25, 100%, 54%)' }} />
          <p
            key={stepIndex}
            className="text-base font-semibold animate-fade-in"
            style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}
          >
            {steps[stepIndex]}
          </p>
        </div>
        <p className="text-sm" style={{ color: 'hsl(215, 20%, 50%)' }}>
          Searching within 5 km radius
        </p>
      </div>

      {/* === PROGRESS === */}
      <div className="w-full max-w-xs mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>
            {foundCount} of {findings.length} offices found
          </span>
          <span className="text-xs font-bold" style={{ color: 'hsl(25, 100%, 54%)' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'hsl(220, 17%, 12%)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
              boxShadow: '0 0 12px hsl(25, 100%, 54%, 0.5)',
            }}
          />
        </div>
      </div>

      {/* === FINDINGS CHIPS === */}
      <div className="flex flex-wrap gap-2 justify-center">
        {findings.map((name, i) => (
          <div
            key={name}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-500 ${
              i < foundCount ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
            }`}
            style={{
              background: i < foundCount ? 'hsl(25, 100%, 54%, 0.15)' : 'hsl(220, 17%, 10%)',
              border: `1px solid ${i < foundCount ? 'hsl(25, 100%, 54%, 0.4)' : 'hsl(220, 17%, 16%)'}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: i < foundCount ? 'hsl(142, 71%, 45%)' : 'hsl(215, 20%, 35%)' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: i < foundCount ? 'hsl(210, 40%, 90%)' : 'hsl(215, 20%, 40%)' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchingScreen;
