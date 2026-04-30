import { useState } from 'react';
import {
  ArrowLeft, MapPin, Star, Clock, Shield, Zap,
  ChevronRight, Award, SlidersHorizontal, TrendingUp
} from 'lucide-react';
import { CourierOffice, useApp } from '@/context/AppContext';

interface NearbyCouriersProps {
  onBack: () => void;
  onSelectCourier: (courier: CourierOffice) => void;
}

/* ═══════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════ */
const mockCouriers: CourierOffice[] = [
  {
    id: '1',
    name: 'SpeedX Logistics',
    distance: 1.2,
    rating: 4.8,
    startingPrice: 49,
    address: 'Shop 12, Commerce Complex, MG Road',
    lat: 19.076, lng: 72.877,
    weightChart: [
      { range: '0 - 500g', price: 49 }, { range: '500g - 1kg', price: 79 },
      { range: '1 - 2kg', price: 129 }, { range: '2 - 5kg', price: 199 },
      { range: '5 - 10kg', price: 349 },
    ],
    reviews: [
      { id: '1', userName: 'Rahul S.', rating: 5, comment: 'Fast and reliable!', date: '2 days ago' },
      { id: '2', userName: 'Priya M.', rating: 4, comment: 'Good experience', date: '1 week ago' },
    ],
  },
  {
    id: '2',
    name: 'BlueDart Express',
    distance: 2.4,
    rating: 4.5,
    startingPrice: 59,
    address: 'Unit 5, Industrial Estate, Andheri',
    lat: 19.116, lng: 72.847,
    weightChart: [
      { range: '0 - 500g', price: 59 }, { range: '500g - 1kg', price: 89 },
      { range: '1 - 2kg', price: 149 }, { range: '2 - 5kg', price: 229 },
      { range: '5 - 10kg', price: 399 },
    ],
    reviews: [
      { id: '1', userName: 'Amit K.', rating: 5, comment: 'Excellent tracking!', date: '3 days ago' },
    ],
  },
  {
    id: '3',
    name: 'DTDC Courier',
    distance: 3.1,
    rating: 4.3,
    startingPrice: 39,
    address: 'Ground Floor, Sahara Mall, Vile Parle',
    lat: 19.096, lng: 72.857,
    weightChart: [
      { range: '0 - 500g', price: 39 }, { range: '500g - 1kg', price: 69 },
      { range: '1 - 2kg', price: 109 }, { range: '2 - 5kg', price: 179 },
      { range: '5 - 10kg', price: 299 },
    ],
    reviews: [
      { id: '1', userName: 'Sneha P.', rating: 4, comment: 'Affordable!', date: '5 days ago' },
    ],
  },
  {
    id: '4',
    name: 'FedEx Office',
    distance: 4.2,
    rating: 4.7,
    startingPrice: 99,
    address: 'Tower B, Business Park, BKC',
    lat: 19.066, lng: 72.867,
    weightChart: [
      { range: '0 - 500g', price: 99 }, { range: '500g - 1kg', price: 149 },
      { range: '1 - 2kg', price: 249 }, { range: '2 - 5kg', price: 399 },
      { range: '5 - 10kg', price: 599 },
    ],
    reviews: [
      { id: '1', userName: 'Vikram R.', rating: 5, comment: 'Premium service!', date: '1 day ago' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   AI RECOMMENDATION ENGINE
═══════════════════════════════════════════════════════════════ */
interface ScoredCourier extends CourierOffice {
  score: number;
  scoreBreakdown: {
    priceScore: number;
    ratingScore: number;
    distanceScore: number;
    speedScore: number;
  };
  priceForWeight: number;
  isRecommended: boolean;
  recommendReason: string;
}

const getPriceForWeight = (courier: CourierOffice, weight: number): number => {
  if (weight <= 0.5) return courier.weightChart[0]?.price ?? courier.startingPrice;
  if (weight <= 1)   return courier.weightChart[1]?.price ?? courier.startingPrice;
  if (weight <= 2)   return courier.weightChart[2]?.price ?? courier.startingPrice;
  if (weight <= 5)   return courier.weightChart[3]?.price ?? courier.startingPrice;
  return courier.weightChart[4]?.price ?? courier.startingPrice;
};

const normalize = (val: number, min: number, max: number): number =>
  min === max ? 1 : (val - min) / (max - min);

const generateRecommendReason = (b: ScoredCourier['scoreBreakdown']): string => {
  const best = Object.entries(b).reduce((a, c) => (c[1] > a[1] ? c : a));
  switch (best[0]) {
    case 'priceScore':    return 'Best price for your package weight';
    case 'ratingScore':   return 'Highest customer satisfaction score';
    case 'distanceScore': return 'Closest courier to your location';
    case 'speedScore':    return 'Fastest estimated delivery time';
    default:              return 'Best balance of price, speed & reliability';
  }
};

const computeRecommendations = (
  couriers: CourierOffice[],
  weight: number,
): ScoredCourier[] => {
  const prices    = couriers.map((c) => getPriceForWeight(c, weight));
  const ratings   = couriers.map((c) => c.rating);
  const distances = couriers.map((c) => c.distance);

  const minPrice = Math.min(...prices),    maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings),  maxRating = Math.max(...ratings);
  const minDist = Math.min(...distances),  maxDist = Math.max(...distances);

  const scored = couriers.map((courier, i) => {
    // Lower price → higher priceScore (inverted)
    const priceScore    = normalize(maxPrice - prices[i],     0, maxPrice - minPrice);
    // Higher rating → higher ratingScore
    const ratingScore   = normalize(ratings[i],   minRating, maxRating);
    // Smaller distance → higher distanceScore (inverted)
    const distanceScore = normalize(maxDist - distances[i],   0, maxDist - minDist);
    // Speed proxy: inverse of distance × rating boost
    const speedScore    = (distanceScore * 0.6 + ratingScore * 0.4);

    const totalScore =
      priceScore    * 35 +
      ratingScore   * 30 +
      distanceScore * 20 +
      speedScore    * 15;

    const breakdown = { priceScore, ratingScore, distanceScore, speedScore };
    return {
      ...courier,
      score: Math.round(totalScore),
      scoreBreakdown: breakdown,
      priceForWeight: prices[i],
      isRecommended: false,
      recommendReason: generateRecommendReason(breakdown),
    };
  });

  // Sort descending — top scorer is #1
  scored.sort((a, b) => b.score - a.score);
  scored[0].isRecommended = true;
  scored[0].recommendReason = 'Best balance of price, speed & reliability';

  return scored;
};

/* ═══════════════════════════════════════════════════════════════
   SORT OPTIONS
═══════════════════════════════════════════════════════════════ */
type SortKey = 'recommended' | 'price' | 'rating' | 'distance';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: '⭐ Best' },
  { id: 'price',       label: '💰 Price' },
  { id: 'rating',      label: '⭐ Rating' },
  { id: 'distance',    label: '📍 Distance' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
const NearbyCouriers = ({ onBack, onSelectCourier }: NearbyCouriersProps) => {
  const { shipmentDetails } = useApp();
  const weight = shipmentDetails?.packageWeight ?? 1;

  const [sortKey, setSortKey] = useState<SortKey>('recommended');
  const [showSortPicker, setShowSortPicker] = useState(false);

  const scored = computeRecommendations(mockCouriers, weight);

  const sorted = [...scored].sort((a, b) => {
    switch (sortKey) {
      case 'price':    return a.priceForWeight - b.priceForWeight;
      case 'rating':   return b.rating - a.rating;
      case 'distance': return a.distance - b.distance;
      default:         return b.score - a.score; // recommended
    }
  });

  const getRatingColor = (r: number) =>
    r >= 4.7 ? '#22C55E' : r >= 4.3 ? '#F59E0B' : '#EF4444';

  /* Score bar segment widths */
  const ScoreBar = ({ value, color }: { value: number; color: string }) => (
    <div className="h-1 rounded-full flex-1" style={{ background: 'hsl(220,17%,16%)' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.round(value * 100)}%`, background: color }}
      />
    </div>
  );

  return (
    <div className="min-h-screen pb-6" style={{ background: 'hsl(220, 17%, 5%)' }}>

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
            id="couriers-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Choose Courier
            </h1>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>
              {weight} kg · {sorted.length} couriers found
            </p>
          </div>
          {/* Sort button */}
          <button
            id="sort-btn"
            onClick={() => setShowSortPicker((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all active:scale-95"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'hsl(215, 20%, 60%)' }} />
            <span className="text-xs font-semibold" style={{ color: 'hsl(215, 20%, 60%)' }}>Sort</span>
          </button>
        </div>

        {/* Sort picker dropdown */}
        {showSortPicker && (
          <div
            className="flex gap-2 mt-3 animate-slide-down"
            style={{ overflowX: 'auto', paddingBottom: 2 }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                id={`sort-${opt.id}`}
                onClick={() => { setSortKey(opt.id); setShowSortPicker(false); }}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: sortKey === opt.id
                    ? 'linear-gradient(135deg, hsl(25,100%,54%), hsl(38,100%,60%))'
                    : 'hsl(220, 17%, 12%)',
                  color: sortKey === opt.id ? 'white' : 'hsl(215, 20%, 60%)',
                  border: `1px solid ${sortKey === opt.id ? 'transparent' : 'hsl(220, 17%, 18%)'}`,
                  boxShadow: sortKey === opt.id ? '0 4px 12px hsl(25,100%,54%,0.3)' : 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MAP SECTION ── */}
      <div
        className="relative mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ height: 160, border: '1px solid hsl(220, 17%, 14%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'hsl(220, 17%, 8%)',
            backgroundImage: `
              linear-gradient(hsl(220, 17%, 11%) 1px, transparent 1px),
              linear-gradient(90deg, hsl(220, 17%, 11%) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, hsl(220, 17%, 5%) 100%)' }} />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 160" fill="none">
          <path d="M 60 130 Q 130 40 200 80 T 340 60" stroke="url(#mapGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 5" opacity="0.7" />
          <defs>
            <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B1A" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
        </svg>

        {sorted.map((c, i) => (
          <div key={c.id} className="absolute" style={{ top: `${15 + i * 18}%`, left: `${15 + i * 19}%` }}>
            <div className="absolute rounded-full animate-ping-slow" style={{ width: 18, height: 18, background: c.isRecommended ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,26,0.3)', top: -3, left: -3 }} />
            <div className="w-3 h-3 rounded-full" style={{ background: c.isRecommended ? '#22C55E' : '#FF6B1A', boxShadow: `0 0 8px ${c.isRecommended ? '#22C55E' : '#FF6B1A'}99` }} />
          </div>
        ))}

        {/* AI badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'hsl(220, 17%, 9% / 0.9)', border: '1px solid hsl(142, 71%, 45%, 0.3)' }}
        >
          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
          <span className="text-xs font-bold" style={{ color: '#22C55E' }}>AI Ranked</span>
        </div>
      </div>

      {/* ── COURIER LIST ── */}
      <div className="px-4 mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
            {scored[0].isRecommended ? '⭐ AI Ranked Results' : 'Available Couriers'}
          </h2>
          <span className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>
            For {weight} kg package
          </span>
        </div>

        {sorted.map((courier, index) => {
          const ratingColor = getRatingColor(courier.rating);

          return (
            <button
              key={courier.id}
              id={`courier-card-${courier.id}`}
              onClick={() => onSelectCourier(courier)}
              className="w-full text-left animate-slide-up"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div
                className="relative overflow-hidden rounded-2xl p-4 transition-all duration-300 group"
                style={{
                  /* ── RECOMMENDED: green-gradient border + glass bg ── */
                  background: courier.isRecommended
                    ? 'linear-gradient(135deg, hsl(142, 60%, 8%), hsl(160, 50%, 6%))'
                    : 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                  border: courier.isRecommended
                    ? '2px solid rgba(34,197,94,0.55)'
                    : '1.5px solid hsl(220, 17%, 14%)',
                  boxShadow: courier.isRecommended
                    ? '0 8px 36px rgba(34,197,94,0.18), 0 0 0 1px rgba(34,197,94,0.1)'
                    : 'var(--shadow-card)',
                  transform: courier.isRecommended ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                {/* ── RECOMMENDED glow orb ── */}
                {courier.isRecommended && (
                  <div
                    className="absolute top-0 right-0 pointer-events-none"
                    style={{
                      width: 160, height: 160,
                      background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                      transform: 'translate(30%, -30%)', filter: 'blur(24px)',
                    }}
                  />
                )}

                {/* ── TOP BADGES ROW ── */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {courier.isRecommended && (
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl animate-pulse-glow"
                        style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.45)' }}
                      >
                        <Award className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                        <span className="text-[10px] font-black tracking-wide" style={{ color: '#22C55E' }}>
                          ⭐ RECOMMENDED
                        </span>
                      </div>
                    )}
                    {index === 0 && !courier.isRecommended && null}
                  </div>

                  {/* Score chip */}
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{
                      background: courier.isRecommended ? 'rgba(34,197,94,0.12)' : 'hsl(220, 17%, 14%)',
                      border: `1px solid ${courier.isRecommended ? 'rgba(34,197,94,0.3)' : 'hsl(220, 17%, 18%)'}`,
                    }}
                  >
                    <TrendingUp className="w-3 h-3" style={{ color: courier.isRecommended ? '#22C55E' : 'hsl(215, 20%, 50%)' }} />
                    <span className="text-[10px] font-bold" style={{ color: courier.isRecommended ? '#22C55E' : 'hsl(215, 20%, 55%)' }}>
                      {courier.score}/100
                    </span>
                  </div>
                </div>

                {/* ── COURIER INFO ── */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-white shrink-0"
                    style={{
                      background: courier.isRecommended
                        ? 'linear-gradient(135deg, #16A34A, #22C55E)'
                        : `linear-gradient(135deg, ${ratingColor}30, ${ratingColor}15)`,
                      border: `1px solid ${courier.isRecommended ? 'rgba(34,197,94,0.5)' : `${ratingColor}40`}`,
                    }}
                  >
                    {courier.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-bold mb-0.5"
                      style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}
                    >
                      {courier.name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3" style={{ color: 'hsl(215, 20%, 50%)' }} />
                      <span className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>
                        {courier.distance} km away
                      </span>
                    </div>
                    {/* AI reason */}
                    {courier.isRecommended && (
                      <p className="text-[11px] font-medium" style={{ color: 'rgba(34,197,94,0.85)' }}>
                        ✦ {courier.recommendReason}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  <div
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl shrink-0"
                    style={{ background: `${ratingColor}18`, border: `1px solid ${ratingColor}35` }}
                  >
                    <Star className="w-3 h-3 fill-current" style={{ color: ratingColor }} />
                    <span className="text-xs font-bold" style={{ color: ratingColor }}>{courier.rating}</span>
                  </div>
                </div>

                {/* ── AI SCORE BREAKDOWN ── */}
                {courier.isRecommended && (
                  <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(34,197,94,0.7)' }}>
                      Score Breakdown
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Price',    value: courier.scoreBreakdown.priceScore,    color: '#22C55E' },
                        { label: 'Rating',   value: courier.scoreBreakdown.ratingScore,   color: '#06B6D4' },
                        { label: 'Distance', value: courier.scoreBreakdown.distanceScore, color: '#F59E0B' },
                        { label: 'Speed',    value: courier.scoreBreakdown.speedScore,    color: '#A78BFA' },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-[10px] w-14 shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                          <ScoreBar value={value} color={color} />
                          <span className="text-[10px] font-bold w-8 text-right" style={{ color }}>
                            {Math.round(value * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── FEATURE CHIPS ── */}
                <div className="flex items-center gap-2 mb-4">
                  {[
                    { icon: Zap,    label: 'Fast Pickup' },
                    { icon: Shield, label: 'Insured' },
                    ...(courier.isRecommended ? [{ icon: Award, label: 'Top Choice' }] : []),
                  ].map((chip) => (
                    <div
                      key={chip.label}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{
                        background: courier.isRecommended ? 'rgba(34,197,94,0.1)' : 'hsl(220, 17%, 13%)',
                        border: `1px solid ${courier.isRecommended ? 'rgba(34,197,94,0.25)' : 'hsl(220, 17%, 17%)'}`,
                      }}
                    >
                      <chip.icon className="w-3 h-3" style={{ color: courier.isRecommended ? '#22C55E' : 'hsl(25, 100%, 54%)' }} />
                      <span className="text-[10px] font-medium" style={{ color: courier.isRecommended ? 'rgba(34,197,94,0.9)' : 'hsl(215, 20%, 60%)' }}>
                        {chip.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── BOTTOM ROW ── */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium mb-0.5" style={{ color: 'hsl(215, 20%, 50%)' }}>
                      For {weight}kg package
                    </p>
                    <p
                      className="text-xl font-black"
                      style={{
                        color: courier.isRecommended ? '#22C55E' : '#FF6B1A',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      ₹{courier.priceForWeight}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group-hover:shadow-lg"
                    style={{
                      background: courier.isRecommended
                        ? 'linear-gradient(135deg, #16A34A, #22C55E)'
                        : 'linear-gradient(135deg, hsl(25,100%,54%), hsl(38,100%,60%))',
                      color: 'white',
                      boxShadow: courier.isRecommended
                        ? '0 4px 14px rgba(34,197,94,0.4)'
                        : '0 4px 14px hsl(25,100%,54%,0.3)',
                    }}
                  >
                    {courier.isRecommended ? 'Select ★' : 'View'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* ── HOW AI SCORE WORKS ── */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
          style={{ background: 'hsl(220, 17%, 8%)', border: '1px solid hsl(220, 17%, 13%)' }}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(34,197,94,0.12)' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
          </div>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'hsl(210, 40%, 85%)' }}>How AI Score Works</p>
            <p className="text-[11px]" style={{ color: 'hsl(215, 20%, 48%)' }}>
              Score = Price (35%) + Rating (30%) + Distance (20%) + Speed (15%).
              The top-scoring courier is highlighted as Recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Mini ScoreBar used inline ── */
const ScoreBar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 rounded-full flex-1" style={{ background: 'hsl(220,17%,14%)' }}>
    <div className="h-full rounded-full" style={{ width: `${Math.round(value * 100)}%`, background: color }} />
  </div>
);

export default NearbyCouriers;
