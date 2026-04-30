import { useState } from 'react';
import { ArrowLeft, Star, MapPin, Phone, Clock, Shield, ChevronRight, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourierOffice, useApp } from '@/context/AppContext';

interface CourierDetailsProps {
  courier: CourierOffice;
  onBack: () => void;
  onSelectCourier: () => void;
}

type Tab = 'weight' | 'reviews' | 'info';

const TABS: { id: Tab; label: string }[] = [
  { id: 'weight', label: 'Pricing' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'info', label: 'Info' },
];

const CourierDetails = ({ courier, onBack, onSelectCourier }: CourierDetailsProps) => {
  const { shipmentDetails, setSelectedCourier } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('weight');

  const handleSelect = () => {
    setSelectedCourier(courier);
    onSelectCourier();
  };

  const getPrice = () => {
    if (!shipmentDetails) return courier.startingPrice;
    const w = shipmentDetails.packageWeight;
    if (w <= 0.5) return courier.weightChart[0]?.price ?? courier.startingPrice;
    if (w <= 1)   return courier.weightChart[1]?.price ?? courier.startingPrice;
    if (w <= 2)   return courier.weightChart[2]?.price ?? courier.startingPrice;
    if (w <= 5)   return courier.weightChart[3]?.price ?? courier.startingPrice;
    return courier.weightChart[4]?.price ?? courier.startingPrice;
  };

  const ratingColor = courier.rating >= 4.7 ? 'hsl(142, 71%, 45%)' : courier.rating >= 4.3 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)';

  return (
    <div className="min-h-screen pb-32" style={{ background: 'hsl(220, 17%, 5%)' }}>
      {/* === HEADER === */}
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(220, 17%, 12%)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            id="details-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
            Courier Details
          </h1>
        </div>
      </div>

      {/* === HERO CARD === */}
      <div className="p-4">
        <div
          className="relative overflow-hidden rounded-3xl p-5 animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(220, 17%, 15%)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute right-0 top-0 pointer-events-none"
            style={{
              width: 160, height: 160,
              background: `radial-gradient(circle, ${ratingColor}20 0%, transparent 70%)`,
              transform: 'translate(30%, -30%)',
              filter: 'blur(30px)',
            }}
          />

          <div className="relative">
            {/* Name + rating row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${ratingColor}30, ${ratingColor}15)`,
                    border: `1.5px solid ${ratingColor}40`,
                  }}
                >
                  {courier.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-0.5" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
                    {courier.name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" style={{ color: 'hsl(215, 20%, 50%)' }} />
                    <span className="text-sm" style={{ color: 'hsl(215, 20%, 50%)' }}>{courier.distance} km away</span>
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
                style={{ background: `${ratingColor}18`, border: `1px solid ${ratingColor}35` }}
              >
                <Star className="w-4 h-4 fill-current" style={{ color: ratingColor }} />
                <span className="text-base font-black" style={{ color: ratingColor }}>{courier.rating}</span>
              </div>
            </div>

            {/* Address */}
            <p className="text-sm mb-4" style={{ color: 'hsl(215, 20%, 52%)' }}>{courier.address}</p>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Zap, label: 'Fast Pickup', color: 'hsl(25, 100%, 54%)' },
                { icon: Shield, label: 'Insured Delivery', color: 'hsl(142, 71%, 45%)' },
                { icon: Award, label: 'Top Rated', color: 'hsl(38, 92%, 50%)' },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: `${chip.color}12`, border: `1px solid ${chip.color}30` }}
                >
                  <chip.icon className="w-3 h-3" style={{ color: chip.color }} />
                  <span className="text-xs font-semibold" style={{ color: chip.color }}>{chip.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === TAB BAR === */}
      <div className="px-4 mb-4">
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: 'hsl(220, 17%, 9%)', border: '1px solid hsl(220, 17%, 14%)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : 'hsl(215, 20%, 50%)',
                boxShadow: activeTab === tab.id ? '0 4px 14px hsl(25, 100%, 54%, 0.35)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* === TAB CONTENT === */}
      <div className="px-4 space-y-3 animate-fade-in">
        {/* ── WEIGHT / PRICING ── */}
        {activeTab === 'weight' && (
          <>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid hsl(220, 17%, 14%)' }}
            >
              <div
                className="px-4 py-3"
                style={{ background: 'hsl(220, 17%, 10%)', borderBottom: '1px solid hsl(220, 17%, 14%)' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(215, 20%, 45%)', letterSpacing: '0.12em' }}>
                  Price Chart
                </p>
              </div>
              {courier.weightChart.map((slab, i) => {
                const w = shipmentDetails?.packageWeight ?? 0;
                const isActive =
                  (i === 0 && w <= 0.5) ||
                  (i === 1 && w > 0.5 && w <= 1) ||
                  (i === 2 && w > 1 && w <= 2) ||
                  (i === 3 && w > 2 && w <= 5) ||
                  (i === 4 && w > 5);
                return (
                  <div
                    key={slab.range}
                    className="flex items-center justify-between px-4 py-3.5 transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'linear-gradient(90deg, hsl(25, 100%, 54%, 0.12), hsl(38, 100%, 60%, 0.06))'
                        : i % 2 === 0 ? 'hsl(220, 17%, 8%)' : 'hsl(220, 17%, 7%)',
                      borderLeft: isActive ? '3px solid hsl(25, 100%, 54%)' : '3px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'hsl(25, 100%, 54%, 0.2)', color: 'hsl(25, 100%, 60%)' }}
                        >
                          Your Package
                        </span>
                      )}
                      <span className="text-sm font-medium" style={{ color: isActive ? 'hsl(210, 40%, 96%)' : 'hsl(215, 20%, 65%)' }}>
                        {slab.range}
                      </span>
                    </div>
                    <span
                      className="text-base font-black"
                      style={{
                        color: isActive ? 'hsl(25, 100%, 54%)' : 'hsl(215, 20%, 70%)',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      ₹{slab.price}
                    </span>
                  </div>
                );
              })}
            </div>

            {shipmentDetails && (
              <div
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(25, 100%, 54%, 0.15), hsl(38, 100%, 60%, 0.08))',
                  border: '1px solid hsl(25, 100%, 54%, 0.3)',
                }}
              >
                <span className="text-sm font-semibold" style={{ color: 'hsl(215, 20%, 70%)' }}>
                  Your package ({shipmentDetails.packageWeight} kg)
                </span>
                <span
                  className="text-2xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  ₹{getPrice()}
                </span>
              </div>
            )}
          </>
        )}

        {/* ── REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="space-y-3">
            {courier.reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-2xl animate-slide-up"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                  border: '1px solid hsl(220, 17%, 14%)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))' }}
                    >
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 96%)' }}>{review.userName}</p>
                      <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        style={{
                          color: i < review.rating ? 'hsl(38, 92%, 50%)' : 'hsl(220, 17%, 20%)',
                          fill: i < review.rating ? 'hsl(38, 92%, 50%)' : 'hsl(220, 17%, 20%)',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'hsl(215, 20%, 60%)' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── INFO ── */}
        {activeTab === 'info' && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
              border: '1px solid hsl(220, 17%, 14%)',
            }}
          >
            {[
              { icon: MapPin, label: 'Address', value: courier.address, color: 'hsl(25, 100%, 54%)' },
              { icon: Phone, label: 'Phone',   value: '+91 98765 43210',  color: 'hsl(142, 71%, 45%)' },
              { icon: Clock, label: 'Hours',   value: '9:00 AM – 8:00 PM', color: 'hsl(38, 92%, 50%)' },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4"
                style={{ borderTop: i > 0 ? '1px solid hsl(220, 17%, 13%)' : 'none' }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: 'hsl(215, 20%, 50%)' }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* === FIXED CTA === */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid hsl(220, 17%, 12%)',
        }}
      >
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>Estimated Price</p>
            <p
              className="text-2xl font-black"
              style={{
                background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              ₹{getPrice()}
            </p>
          </div>
          <button
            id="select-courier-btn"
            onClick={handleSelect}
            className="flex-1 h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
              color: 'white',
              boxShadow: '0 8px 24px hsl(25, 100%, 54%, 0.4)',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Select Courier
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourierDetails;
