import { useState, useRef } from 'react';
import {
  ArrowLeft, ChevronRight, FileText, Box, Camera,
  Package, Truck, Weight, Feather, Info, Lightbulb,
  Upload, X, Check, HelpCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface WeightSelectionProps {
  onBack: () => void;
  onSubmit: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   WEIGHT CATEGORIES
═══════════════════════════════════════════════════════════════ */
interface WeightCategory {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  minKg: number;
  maxKg: number | null;
  priceRange: string;
  gradient: string;
  glow: string;
  accentColor: string;
  realWorldHint: string;
}

const weightCategories: WeightCategory[] = [
  {
    id: 'feather', label: 'Feather', sublabel: '0 – 500g',
    icon: Feather, minKg: 0.1, maxKg: 0.5,
    priceRange: '₹39 – ₹79',
    gradient: 'linear-gradient(135deg, #06B6D4, #0EA5E9)',
    glow: 'rgba(6,182,212,0.35)', accentColor: '#06B6D4',
    realWorldHint: '📄 A few documents or letters',
  },
  {
    id: 'light', label: 'Light', sublabel: '500g – 2kg',
    icon: Package, minKg: 0.5, maxKg: 2,
    priceRange: '₹79 – ₹149',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
    glow: 'rgba(16,185,129,0.35)', accentColor: '#10B981',
    realWorldHint: '📚 A thick book or small gadget',
  },
  {
    id: 'medium', label: 'Medium', sublabel: '2kg – 5kg',
    icon: Box, minKg: 2, maxKg: 5,
    priceRange: '₹149 – ₹299',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
    glow: 'rgba(245,158,11,0.35)', accentColor: '#F59E0B',
    realWorldHint: '📦 Shoes box or laptop in box',
  },
  {
    id: 'heavy', label: 'Heavy', sublabel: '5kg – 10kg',
    icon: Weight, minKg: 5, maxKg: 10,
    priceRange: '₹299 – ₹499',
    gradient: 'linear-gradient(135deg, #EF4444, #F87171)',
    glow: 'rgba(239,68,68,0.35)', accentColor: '#EF4444',
    realWorldHint: '🏋️ Textbooks or small appliance',
  },
  {
    id: 'freight', label: 'Freight', sublabel: '10kg+',
    icon: Truck, minKg: 10, maxKg: null,
    priceRange: '₹499+',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    glow: 'rgba(139,92,246,0.35)', accentColor: '#8B5CF6',
    realWorldHint: '🛒 Large box or multiple items',
  },
];

/* ─── Weight guide data ─────────────────────────────────────── */
const weightGuide = [
  { item: 'A4 Documents / Letters',             approx: '~200g',   icon: '📄' },
  { item: 'Thick Novel / Textbook',             approx: '~500g–1kg', icon: '📚' },
  { item: 'Pair of Shoes (boxed)',              approx: '~1.5kg',  icon: '👟' },
  { item: 'Laptop in Packaging',                approx: '~2.5kg',  icon: '💻' },
  { item: 'Small Kitchen Appliance',            approx: '~3–5kg',  icon: '🍳' },
  { item: 'Medium Suitcase (half full)',         approx: '~8–10kg', icon: '🧳' },
];

/* ─── AI image scan results (simulated) ────────────────────── */
const simulatedImageScan = (): { estimatedRange: string; category: string; confidence: number } => {
  const results = [
    { estimatedRange: '1–2 kg', category: 'light',  confidence: 82 },
    { estimatedRange: '2–4 kg', category: 'medium', confidence: 76 },
    { estimatedRange: '0.5–1 kg', category: 'light', confidence: 89 },
    { estimatedRange: '3–5 kg', category: 'medium', confidence: 71 },
  ];
  return results[Math.floor(Math.random() * results.length)];
};

const clampedPct = (val: number, min: number, max: number) =>
  Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
const WeightSelection = ({ onBack, onSubmit }: WeightSelectionProps) => {
  const { shipmentDetails, setShipmentDetails } = useApp();

  const [selectedCat, setSelectedCat] = useState<string>('light');
  const [packageType, setPackageType] = useState<'document' | 'parcel'>('parcel');
  const [preciseWeight, setPreciseWeight] = useState<number>(1);
  const [showGuide, setShowGuide] = useState(false);

  // Image-based estimation state
  const [packageImage, setPackageImage] = useState<string | null>(null);
  const [imageScanning, setImageScanning] = useState(false);
  const [imageScanResult, setImageScanResult] = useState<{ estimatedRange: string; category: string; confidence: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCat = weightCategories.find((c) => c.id === selectedCat)!;

  const handleSelectCat = (cat: WeightCategory) => {
    setSelectedCat(cat.id);
    const mid = cat.maxKg ? (cat.minKg + cat.maxKg) / 2 : cat.minKg + 5;
    setPreciseWeight(parseFloat(mid.toFixed(1)));
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreciseWeight(parseFloat(e.target.value));
  };

  const estimatedPrice = () => {
    if (preciseWeight <= 0.5) return '₹39 – ₹79';
    if (preciseWeight <= 1)   return '₹69 – ₹129';
    if (preciseWeight <= 2)   return '₹109 – ₹199';
    if (preciseWeight <= 5)   return '₹179 – ₹299';
    if (preciseWeight <= 10)  return '₹299 – ₹499';
    return '₹499+';
  };

  const sliderMin = activeCat.minKg;
  const sliderMax = activeCat.maxKg ?? activeCat.minKg + 40;
  const sliderPct = clampedPct(preciseWeight, sliderMin, sliderMax);

  /* ── Image upload handler ── */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPackageImage(reader.result as string);
      setImageScanning(true);
      setImageScanResult(null);
      // Simulate AI processing delay
      setTimeout(() => {
        const result = simulatedImageScan();
        setImageScanResult(result);
        setImageScanning(false);
        // Auto-select the suggested category
        const cat = weightCategories.find(c => c.id === result.category);
        if (cat) handleSelectCat(cat);
      }, 2200);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPackageImage(null);
    setImageScanResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Continue ── */
  const handleContinue = () => {
    if (!shipmentDetails) return;
    setShipmentDetails({
      ...shipmentDetails,
      packageWeight: preciseWeight,
      packageType,
      imageEstimatedWeight: imageScanResult?.estimatedRange,
      packageImageUrl: packageImage ?? undefined,
    });
    onSubmit();
  };

  return (
    <div className="min-h-screen pb-36" style={{ background: 'hsl(220, 17%, 5%)' }}>

      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.93)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(220, 17%, 12%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            id="weight-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Package Weight
            </h1>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>Step 3 of 5</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map((s) => (
              <div
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: s === 3 ? 20 : 6,
                  height: 6,
                  background: s <= 3
                    ? 'linear-gradient(90deg, #10B981, #06B6D4)'
                    : 'hsl(220, 17%, 18%)',
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* ── TITLE ── */}
        <div className="animate-slide-up">
          <h2 className="text-2xl font-black mb-1" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
            How heavy is your{' '}
            <span style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              package?
            </span>
          </h2>
          <p className="text-sm" style={{ color: 'hsl(215, 20%, 50%)' }}>
            Select a category, upload a photo, or use the guide
          </p>
        </div>

        {/* ═══  📸 IMAGE-BASED WEIGHT ESTIMATION  ═══ */}
        <div
          className="rounded-2xl p-4 animate-slide-up stagger-1"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
            border: `1.5px solid ${packageImage ? '#06B6D4' : 'hsl(220, 17%, 14%)'}40`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" style={{ color: '#06B6D4' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(215, 20%, 45%)', letterSpacing: '0.12em' }}>
                Smart Weight Scan
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#06B6D420', color: '#06B6D4', border: '1px solid #06B6D435' }}>
              AI Powered
            </span>
          </div>

          {!packageImage ? (
            <button
              id="upload-package-image"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-3 py-8 rounded-2xl transition-all duration-200 active:scale-98"
              style={{ background: 'hsl(220, 17%, 12%)', border: '2px dashed hsl(220, 17%, 20%)' }}
            >
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ background: '#06B6D418', border: '1px solid #06B6D430' }}>
                <Upload className="w-8 h-8" style={{ color: '#06B6D4' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold mb-0.5" style={{ color: 'hsl(210, 40%, 90%)' }}>
                  Upload package photo
                </p>
                <p className="text-xs" style={{ color: 'hsl(215, 20%, 48%)' }}>
                  Our AI will estimate the weight for you
                </p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              {/* Image preview */}
              <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: 140 }}>
                <img
                  src={packageImage}
                  alt="Package"
                  className="w-full h-36 object-cover rounded-2xl"
                  style={{ filter: imageScanning ? 'brightness(0.6)' : 'brightness(1)' }}
                />
                {/* Scanning overlay */}
                {imageScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-full h-1 relative overflow-hidden rounded-full" style={{ background: '#06B6D420' }}>
                      <div className="absolute inset-0 h-full rounded-full" style={{ background: '#06B6D4', animation: 'scan-line 1.5s ease-in-out infinite' }} />
                    </div>
                    <p className="text-xs font-bold animate-pulse" style={{ color: '#06B6D4' }}>Analyzing package…</p>
                  </div>
                )}
                {/* Clear image */}
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Scan result */}
              {imageScanResult && (
                <div
                  className="flex items-center gap-3 p-3.5 rounded-2xl animate-scale-in"
                  style={{ background: '#22C55E15', border: '1.5px solid #22C55E40' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#22C55E20' }}>
                    <Check className="w-5 h-5" style={{ color: '#22C55E' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: '#22C55E' }}>
                      Estimated: {imageScanResult.estimatedRange}
                    </p>
                    <p className="text-xs" style={{ color: 'hsl(215, 20%, 55%)' }}>
                      {imageScanResult.confidence}% confidence · Category auto-selected
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* ═══  WEIGHT GUIDE TOGGLE  ═══ */}
        <button
          id="weight-guide-toggle"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-99 animate-slide-up stagger-1"
          style={{
            background: showGuide ? '#F59E0B12' : 'hsl(220, 17%, 9%)',
            border: `1px solid ${showGuide ? '#F59E0B35' : 'hsl(220, 17%, 14%)'}`,
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F59E0B18' }}>
            <HelpCircle className="w-4.5 h-4.5" style={{ color: '#F59E0B' }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)' }}>Not sure about weight?</p>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>Tap to see common item weights</p>
          </div>
          <ChevronRight
            className="w-4 h-4 transition-transform duration-200"
            style={{ color: 'hsl(215, 20%, 45%)', transform: showGuide ? 'rotate(90deg)' : 'rotate(0)' }}
          />
        </button>

        {showGuide && (
          <div
            className="rounded-2xl overflow-hidden animate-slide-down"
            style={{ background: 'hsl(220, 17%, 8%)', border: '1px solid hsl(220, 17%, 14%)' }}
          >
            <div className="px-4 py-3" style={{ background: '#F59E0B08', borderBottom: '1px solid hsl(220, 17%, 13%)' }}>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#F59E0B', letterSpacing: '0.12em' }}>Weight Assistance Guide</p>
              </div>
            </div>
            {weightGuide.map((item, i) => (
              <div
                key={item.item}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? '1px solid hsl(220, 17%, 11%)' : 'none' }}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="flex-1 text-xs font-medium" style={{ color: 'hsl(215, 20%, 65%)' }}>{item.item}</span>
                <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>{item.approx}</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══  WEIGHT CATEGORY CARDS  ═══ */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up stagger-2">
          {weightCategories.slice(0, 4).map((cat, i) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                id={`weight-cat-${cat.id}`}
                onClick={() => handleSelectCat(cat)}
                className="relative text-left transition-all duration-300 active:scale-97"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div
                  className="p-4 rounded-2xl relative overflow-hidden"
                  style={{
                    background: isSelected ? cat.gradient : 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 8%))',
                    border: isSelected ? '2px solid transparent' : '1.5px solid hsl(220, 17%, 15%)',
                    boxShadow: isSelected ? `0 10px 30px ${cat.glow}, 0 0 0 2px ${cat.accentColor}40` : 'var(--shadow-card)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 rounded-full pointer-events-none" style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', transform: 'translate(30%, -30%)', filter: 'blur(20px)' }} />
                  )}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3" style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : `${cat.accentColor}18`, border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : `${cat.accentColor}30`}` }}>
                    <Icon className="w-5 h-5" style={{ color: isSelected ? 'white' : cat.accentColor }} />
                  </div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: isSelected ? 'white' : 'hsl(210, 40%, 92%)' }}>{cat.label}</p>
                  <p className="text-xs font-medium mb-1" style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : 'hsl(215, 20%, 50%)' }}>{cat.sublabel}</p>
                  {/* Real-world hint */}
                  <p className="text-[10px] mb-2" style={{ color: isSelected ? 'rgba(255,255,255,0.65)' : 'hsl(215, 20%, 42%)' }}>{cat.realWorldHint}</p>
                  <p className="text-[10px] font-bold" style={{ color: isSelected ? 'rgba(255,255,255,0.9)' : cat.accentColor, background: isSelected ? 'rgba(255,255,255,0.2)' : `${cat.accentColor}15`, border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : `${cat.accentColor}30`}`, padding: '2px 8px', borderRadius: 999, display: 'inline-block' }}>
                    {cat.priceRange}
                  </p>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in" style={{ background: 'rgba(255,255,255,0.3)' }}>
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Freight full-width */}
        {(() => {
          const cat = weightCategories[4];
          const Icon = cat.icon;
          const isSelected = selectedCat === cat.id;
          return (
            <button
              id="weight-cat-freight"
              onClick={() => handleSelectCat(cat)}
              className="w-full text-left transition-all duration-300 active:scale-99 animate-slide-up stagger-3"
            >
              <div
                className="flex items-center gap-4 p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: isSelected ? cat.gradient : 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 8%))',
                  border: isSelected ? '2px solid transparent' : '1.5px solid hsl(220, 17%, 15%)',
                  boxShadow: isSelected ? `0 10px 30px ${cat.glow}` : 'var(--shadow-card)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                {isSelected && <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(30%, -30%)', filter: 'blur(20px)' }} />}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : `${cat.accentColor}18`, border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : `${cat.accentColor}30`}` }}>
                  <Icon className="w-6 h-6" style={{ color: isSelected ? 'white' : cat.accentColor }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-base font-bold" style={{ color: isSelected ? 'white' : 'hsl(210, 40%, 92%)' }}>{cat.label}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : `${cat.accentColor}15`, color: isSelected ? 'white' : cat.accentColor, border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : `${cat.accentColor}30`}` }}>Freight</span>
                  </div>
                  <p className="text-xs" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'hsl(215, 20%, 50%)' }}>{cat.sublabel} · {cat.priceRange}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.55)' : 'hsl(215, 20%, 40%)' }}>{cat.realWorldHint}</p>
                </div>
                {isSelected && <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.3)' }}><span className="text-white text-xs font-bold">✓</span></div>}
              </div>
            </button>
          );
        })()}

        {/* ═══  PRECISE WEIGHT SLIDER  ═══ */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-4"
          style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 14%)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4" style={{ color: activeCat.accentColor }} />
              <span className="text-sm font-bold" style={{ color: 'hsl(215, 20%, 65%)' }}>Precise Weight</span>
            </div>
            <div className="flex items-baseline gap-1 px-3 py-1 rounded-xl" style={{ background: `${activeCat.accentColor}18`, border: `1px solid ${activeCat.accentColor}35` }}>
              <span className="text-2xl font-black" style={{ color: activeCat.accentColor, fontFamily: 'Poppins, sans-serif' }}>
                {preciseWeight}
              </span>
              <span className="text-xs font-bold" style={{ color: activeCat.accentColor }}>kg</span>
            </div>
          </div>

          <div className="relative mb-3">
            <div className="h-2 rounded-full" style={{ background: 'hsl(220, 17%, 15%)' }} />
            <div className="absolute top-0 left-0 h-2 rounded-full pointer-events-none" style={{ width: `${sliderPct}%`, background: activeCat.gradient, boxShadow: `0 0 8px ${activeCat.glow}` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white pointer-events-none" style={{ left: `calc(${sliderPct}% - 10px)`, background: activeCat.gradient, boxShadow: `0 0 12px ${activeCat.glow}` }} />
            <input type="range" min={sliderMin} max={sliderMax} step="0.1" value={preciseWeight} onChange={handleSlider} className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer" />
          </div>
          <div className="flex justify-between text-xs" style={{ color: 'hsl(215, 20%, 40%)' }}>
            <span>{sliderMin} kg</span><span>{sliderMax} kg</span>
          </div>

          {/* Estimated price + disclaimer */}
          <div className="mt-4 p-3 rounded-xl space-y-2" style={{ background: 'hsl(220, 17%, 12%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5" style={{ color: 'hsl(215, 20%, 50%)' }} />
                <span className="text-xs" style={{ color: 'hsl(215, 20%, 55%)' }}>Estimated price range</span>
              </div>
              <span className="text-sm font-black" style={{ color: activeCat.accentColor, fontFamily: 'Poppins, sans-serif' }}>
                {estimatedPrice()}
              </span>
            </div>
            <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 38%)' }}>
              ⚠️ This is an estimate. Final price will be confirmed after on-spot weigh-in by the delivery agent.
            </p>
          </div>
        </div>

        {/* ═══  PACKAGE TYPE  ═══ */}
        <div className="p-4 rounded-2xl animate-slide-up stagger-5" style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 14%)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(215, 20%, 42%)', letterSpacing: '0.12em' }}>Package Type</p>
          <div className="flex gap-3">
            {[
              { type: 'document' as const, icon: FileText, label: 'Document', sub: 'Papers, files, letters', color: '#06B6D4' },
              { type: 'parcel' as const,   icon: Box,      label: 'Parcel',   sub: 'Goods, products',     color: '#10B981' },
            ].map(({ type, icon: Icon, label, sub, color }) => {
              const isActive = packageType === type;
              return (
                <button key={type} id={`pkg-type-${type}`} onClick={() => setPackageType(type)} className="flex-1 p-4 rounded-2xl transition-all duration-250 text-left active:scale-97" style={{ background: isActive ? `linear-gradient(135deg, ${color}22, ${color}10)` : 'hsl(220, 17%, 12%)', border: isActive ? `1.5px solid ${color}60` : '1.5px solid hsl(220, 17%, 17%)', boxShadow: isActive ? `0 4px 16px ${color}25` : 'none' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: isActive ? `${color}20` : 'hsl(220, 17%, 16%)', border: `1px solid ${isActive ? `${color}40` : 'transparent'}` }}>
                    <Icon className="w-5 h-5" style={{ color: isActive ? color : 'hsl(215, 20%, 45%)' }} />
                  </div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: isActive ? 'hsl(210, 40%, 96%)' : 'hsl(215, 20%, 65%)' }}>{label}</p>
                  <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 45%)' }}>{sub}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FIXED CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: 'hsl(220, 17%, 5% / 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid hsl(220, 17%, 12%)' }}>
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>
              {activeCat.label} · {preciseWeight} kg · {packageType === 'document' ? '📄' : '📦'} {packageType}
            </span>
            <span className="text-xs font-bold" style={{ color: activeCat.accentColor }}>
              {estimatedPrice()}
            </span>
          </div>
          <button
            id="weight-continue-btn"
            onClick={handleContinue}
            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: 'white', boxShadow: '0 8px 24px rgba(16,185,129,0.45)', fontFamily: 'Poppins, sans-serif' }}
          >
            Find Best Couriers
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightSelection;
