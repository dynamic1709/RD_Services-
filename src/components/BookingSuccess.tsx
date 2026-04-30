import { useEffect, useState } from 'react';
import { CheckCircle, Home, MapPin, Share2, Copy, Scale, Banknote, CreditCard, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface BookingSuccessProps {
  onTrack: () => void;
  onGoHome: () => void;
}

const BookingSuccess = ({ onTrack, onGoHome }: BookingSuccessProps) => {
  const { currentOrder } = useApp();
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!currentOrder) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOrder.bookingId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPayAfterPickup = currentOrder.paymentMethod === 'pay_after_pickup';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'hsl(220, 17%, 5%)' }}
    >
      {/* Background glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, hsl(142, 71%, 45%, 0.1) 0%, transparent 65%)',
          filter: 'blur(40px)',
          top: '20%', left: '50%', transform: 'translateX(-50%)',
        }}
      />

      {/* === SUCCESS ICON === */}
      <div className={`relative mb-8 transition-all duration-700 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="absolute rounded-full animate-ping-slow" style={{ inset: -20, border: '1px solid hsl(142, 71%, 45%, 0.3)', borderRadius: '50%' }} />
        <div className="absolute rounded-full" style={{ inset: -10, background: 'radial-gradient(circle, hsl(142, 71%, 45%, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(10px)' }} />
        <div className="w-28 h-28 rounded-full flex items-center justify-center animate-bounce-subtle" style={{ background: 'linear-gradient(135deg, hsl(142, 71%, 38%), hsl(160, 71%, 45%))', boxShadow: '0 16px 48px hsl(142, 71%, 45%, 0.5)' }}>
          <CheckCircle className="w-14 h-14 text-white" strokeWidth={2} />
        </div>
      </div>

      {/* === TEXT === */}
      <div className={`text-center mb-6 transition-all duration-600 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-black mb-2" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
          Booking Confirmed! 🎉
        </h1>
        <p className="text-sm mb-1" style={{ color: 'hsl(215, 20%, 55%)' }}>
          Your courier pickup has been successfully scheduled
        </p>
        {isPayAfterPickup && (
          <p className="text-xs" style={{ color: '#F59E0B' }}>
            💰 You'll pay after the agent confirms weight
          </p>
        )}
      </div>

      {/* === BOOKING CARD === */}
      <div
        className={`w-full max-w-sm mb-4 transition-all duration-600 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ transitionDelay: '150ms' }}
      >
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(142, 71%, 45%, 0.25)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px hsl(142, 71%, 45%, 0.1)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: 'linear-gradient(90deg, hsl(142, 71%, 45%), hsl(160, 71%, 50%))' }} />

          {/* Booking ID */}
          <div className="text-center pb-4 mb-4" style={{ borderBottom: '1px solid hsl(220, 17%, 14%)' }}>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'hsl(215, 20%, 50%)', letterSpacing: '0.1em' }}>BOOKING ID</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-black" style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 62%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Poppins, sans-serif', letterSpacing: '0.06em' }}>
                {currentOrder.bookingId}
              </p>
              <button id="copy-booking-id" onClick={handleCopy} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'hsl(220, 17%, 14%)' }}>
                {copied ? <CheckCircle className="w-4 h-4" style={{ color: 'hsl(142, 71%, 50%)' }} /> : <Copy className="w-4 h-4" style={{ color: 'hsl(215, 20%, 55%)' }} />}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[
              { label: 'Courier', value: currentOrder.courierOffice.name, icon: null },
              { label: 'Pickup Time', value: currentOrder.estimatedPickup, icon: null },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>{label}</span>
                <span className="text-sm font-bold" style={{ color: 'hsl(210, 40%, 90%)' }}>{value}</span>
              </div>
            ))}

            {/* Payment method */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>Payment</span>
              <div className="flex items-center gap-1.5">
                {isPayAfterPickup
                  ? <Banknote className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
                  : <CreditCard className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
                }
                <span className="text-sm font-bold" style={{ color: isPayAfterPickup ? '#22C55E' : '#06B6D4' }}>
                  {isPayAfterPickup ? 'Pay After Pickup' : 'Paid'}
                </span>
              </div>
            </div>

            {/* Price - estimated notice */}
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid hsl(220, 17%, 14%)' }}>
              <div>
                <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>
                  {isPayAfterPickup ? 'Estimated Amount' : 'Amount Paid'}
                </span>
                {isPayAfterPickup && (
                  <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 38%)' }}>Final after weigh-in</p>
                )}
              </div>
              <span className="text-lg font-bold" style={{ color: 'hsl(25, 100%, 56%)' }}>₹{currentOrder.price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === WHAT'S NEXT CARD === */}
      <div
        className={`w-full max-w-sm mb-6 transition-all duration-600 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="p-4 rounded-2xl" style={{ background: '#F59E0B08', border: '1px solid #F59E0B25' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#F59E0B', letterSpacing: '0.12em' }}>What happens next</p>
          <div className="space-y-2.5">
            {[
              { icon: Clock,     text: 'Agent will arrive during your pickup slot',   color: '#06B6D4' },
              { icon: Scale,     text: 'Package will be weighed on the spot',          color: '#F59E0B' },
              { icon: Banknote,  text: isPayAfterPickup ? 'You confirm final price & pay' : 'Any price adjustment will be refunded/charged', color: '#22C55E' },
              { icon: MapPin,    text: 'Parcel is picked up & tracking begins',       color: '#8B5CF6' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <p className="text-xs" style={{ color: 'hsl(215, 20%, 60%)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === ACTIONS === */}
      <div className={`w-full max-w-sm space-y-3 transition-all duration-600 ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <button
          id="track-order-btn"
          onClick={onTrack}
          className="w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
          style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))', color: 'white', boxShadow: '0 8px 24px hsl(25, 100%, 54%, 0.45)', fontFamily: 'Poppins, sans-serif' }}
        >
          <MapPin className="w-5 h-5" />
          Track Order
        </button>

        <div className="flex gap-3">
          <button id="go-home-btn" onClick={onGoHome} className="flex-1 h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all" style={{ background: 'hsl(220, 17%, 10%)', border: '1px solid hsl(220, 17%, 18%)', color: 'hsl(210, 40%, 80%)' }}>
            <Home className="w-4 h-4" />Home
          </button>
          <button id="share-btn" className="flex-1 h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all" style={{ background: 'hsl(220, 17%, 10%)', border: '1px solid hsl(220, 17%, 18%)', color: 'hsl(210, 40%, 80%)' }}>
            <Share2 className="w-4 h-4" />Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
