import { useState } from 'react';
import {
  ArrowLeft, MapPin, Package, Clock, CreditCard, ChevronRight,
  Shield, AlertTriangle, Wallet, Banknote, Info, Scale
} from 'lucide-react';
import { useApp, Order, PaymentMethod } from '@/context/AppContext';

interface OrderSummaryProps {
  onBack: () => void;
  onConfirm: () => void;
}

const OrderSummary = ({ onBack, onConfirm }: OrderSummaryProps) => {
  const {
    shipmentDetails, selectedCourier, selectedSlot,
    addOrder, setCurrentOrder, paymentMethod, setPaymentMethod
  } = useApp();

  const [agreedToEstimate, setAgreedToEstimate] = useState(false);

  if (!shipmentDetails || !selectedCourier || !selectedSlot) return null;

  const getPrice = () => {
    const w = shipmentDetails.packageWeight;
    if (w <= 0.5) return selectedCourier.weightChart[0]?.price ?? selectedCourier.startingPrice;
    if (w <= 1)   return selectedCourier.weightChart[1]?.price ?? selectedCourier.startingPrice;
    if (w <= 2)   return selectedCourier.weightChart[2]?.price ?? selectedCourier.startingPrice;
    if (w <= 5)   return selectedCourier.weightChart[3]?.price ?? selectedCourier.startingPrice;
    return selectedCourier.weightChart[4]?.price ?? selectedCourier.startingPrice;
  };

  const base = getPrice();
  const gst  = Math.round(base * 0.18);
  const total = base + gst;

  const handleConfirm = () => {
    const order: Order = {
      id: Date.now().toString(),
      bookingId: `SWF-${Date.now().toString().slice(-6)}`,
      shipmentDetails,
      courierOffice: selectedCourier,
      selectedSlot,
      status: 'confirmed',
      price: total,
      paymentMethod,
      estimatedPickup: selectedSlot.time.split(' - ')[0],
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    setCurrentOrder(order);
    onConfirm();
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(215, 20%, 42%)', letterSpacing: '0.13em' }}>
      {children}
    </p>
  );

  const Row = ({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) => (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid hsl(220, 17%, 11%)' }}>
      <span className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)', ...valueStyle }}>{value}</span>
    </div>
  );

  const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: typeof Wallet; color: string; recommended: boolean }[] = [
    {
      id: 'pay_after_pickup',
      label: 'Pay After Pickup',
      desc: 'Pay only after agent weighs your package. No surprises.',
      icon: Banknote,
      color: '#22C55E',
      recommended: true,
    },
    {
      id: 'advance_payment',
      label: 'Pay Now (Estimated)',
      desc: 'Pay estimated amount now. Adjustment after weigh-in.',
      icon: CreditCard,
      color: '#06B6D4',
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen pb-36" style={{ background: 'hsl(220, 17%, 5%)' }}>
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
            id="summary-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Order Summary
            </h1>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>Review before confirming</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* === ROUTE CARD === */}
        <div
          className="p-4 rounded-2xl animate-slide-up"
          style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 14%)' }}
        >
          <SectionLabel>Shipping Route</SectionLabel>
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1 gap-1">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(25, 100%, 54%)', boxShadow: '0 0 8px hsl(25, 100%, 54%, 0.6)' }} />
              <div className="w-0.5 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, hsl(25, 100%, 54%), hsl(142, 71%, 45%))' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(142, 71%, 45%)', boxShadow: '0 0 8px hsl(142, 71%, 45%, 0.6)' }} />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-semibold" style={{ color: 'hsl(25, 100%, 60%)' }}>PICKUP</p>
                <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)' }}>{shipmentDetails.pickupAddress || 'Current Location'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold" style={{ color: 'hsl(142, 71%, 50%)' }}>DELIVER TO</p>
                <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)' }}>{shipmentDetails.destinationAddress}</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(215, 20%, 50%)' }}>{shipmentDetails.receiverName} · {shipmentDetails.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* === COURIER & PACKAGE === */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-1"
          style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 14%)' }}
        >
          <SectionLabel>Courier & Package</SectionLabel>
          <div className="flex items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid hsl(220, 17%, 12%)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-base font-bold text-white" style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))' }}>
              {selectedCourier.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'hsl(210, 40%, 96%)' }}>{selectedCourier.name}</p>
              <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>{selectedCourier.distance} km away</p>
            </div>
          </div>
          <Row label="Package Type" value={shipmentDetails.packageType === 'document' ? '📄 Document' : '📦 Parcel'} />
          <Row label="Estimated Weight" value={`${shipmentDetails.packageWeight} kg`} />
          {shipmentDetails.imageEstimatedWeight && (
            <Row label="AI Suggestion" value={`📸 ${shipmentDetails.imageEstimatedWeight}`} />
          )}
        </div>

        {/* === TIME SLOT === */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl animate-slide-up stagger-2"
          style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%, 0.1), hsl(38, 100%, 60%, 0.06))', border: '1px solid hsl(25, 100%, 54%, 0.25)' }}
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))', boxShadow: '0 4px 14px hsl(25, 100%, 54%, 0.4)' }}>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: 'hsl(25, 100%, 65%)' }}>PICKUP WINDOW</p>
            <p className="text-sm font-bold" style={{ color: 'hsl(210, 40%, 96%)' }}>{selectedSlot.time}</p>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 55%)' }}>Today</p>
          </div>
        </div>

        {/* ═══  ⚖️ ON-SPOT WEIGHT NOTICE  ═══ */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-2"
          style={{ background: '#F59E0B0A', border: '1.5px solid #F59E0B30' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#F59E0B18' }}>
              <Scale className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-1" style={{ color: '#F59E0B' }}>On-Spot Weight Confirmation</p>
              <p className="text-xs leading-relaxed" style={{ color: 'hsl(215, 20%, 55%)' }}>
                Our delivery agent will measure the actual weight at pickup. 
                You'll see the exact weight and final price before confirming shipment.
              </p>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { step: '1', label: 'Agent arrives' },
                  { step: '2', label: 'Weigh-in' },
                  { step: '3', label: 'Confirm price' },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: '#F59E0B25', color: '#F59E0B' }}>
                      {s.step}
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: 'hsl(215, 20%, 55%)' }}>{s.label}</span>
                    {i < 2 && <span className="text-xs" style={{ color: 'hsl(220, 17%, 20%)' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══  💳 PAYMENT METHOD  ═══ */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-3"
          style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 14%)' }}
        >
          <SectionLabel>Payment Method</SectionLabel>
          <div className="space-y-3">
            {paymentOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = paymentMethod === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`payment-${opt.id}`}
                  onClick={() => setPaymentMethod(opt.id)}
                  className="w-full text-left p-4 rounded-2xl transition-all duration-200 active:scale-99"
                  style={{
                    background: isActive ? `${opt.color}12` : 'hsl(220, 17%, 12%)',
                    border: isActive ? `2px solid ${opt.color}55` : '1.5px solid hsl(220, 17%, 17%)',
                    boxShadow: isActive ? `0 4px 20px ${opt.color}20` : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: isActive ? `${opt.color}20` : 'hsl(220, 17%, 16%)', border: `1px solid ${isActive ? `${opt.color}40` : 'transparent'}` }}>
                      <Icon className="w-5 h-5" style={{ color: isActive ? opt.color : 'hsl(215, 20%, 50%)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold" style={{ color: isActive ? 'hsl(210, 40%, 96%)' : 'hsl(215, 20%, 65%)' }}>
                          {opt.label}
                        </p>
                        {opt.recommended && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}40` }}>
                            PREFERRED
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>{opt.desc}</p>
                    </div>
                    {/* Radio */}
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1" style={{ borderColor: isActive ? opt.color : 'hsl(220, 17%, 22%)' }}>
                      {isActive && <div className="w-2.5 h-2.5 rounded-full" style={{ background: opt.color }} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* === PRICE BREAKDOWN === */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-4"
          style={{ background: 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 7%))', border: '1px solid hsl(220, 17%, 16%)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
            <SectionLabel>Estimated Price Breakdown</SectionLabel>
          </div>

          {/* Warning badge */}
          <div className="flex items-center gap-2 mb-3 p-2 rounded-lg" style={{ background: '#F59E0B08', border: '1px solid #F59E0B20' }}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: '#F59E0B' }} />
            <p className="text-[10px]" style={{ color: '#F59E0Bcc' }}>
              Final price may vary after on-spot weight measurement
            </p>
          </div>

          <Row label="Base Price (est.)" value={`₹${base}`} />
          <Row label="GST (18%)" value={`₹${gst}`} />
          <div className="flex items-center justify-between pt-3 mt-1">
            <div>
              <span className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)' }}>Estimated Total</span>
              <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 42%)' }}>
                For {shipmentDetails.packageWeight} kg · {shipmentDetails.packageType}
              </p>
            </div>
            <span
              className="text-3xl font-black"
              style={{
                color: 'hsl(25, 100%, 54%)',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              ₹{total}
            </span>
          </div>
        </div>

        {/* === INSURANCE NOTE === */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl animate-fade-in stagger-5"
          style={{ background: 'hsl(142, 71%, 45%, 0.08)', border: '1px solid hsl(142, 71%, 45%, 0.2)' }}
        >
          <Shield className="w-4 h-4 shrink-0" style={{ color: 'hsl(142, 71%, 50%)' }} />
          <p className="text-xs" style={{ color: 'hsl(142, 71%, 60%)' }}>
            Your shipment is protected by SwiftShip Delivery Shield up to ₹10,000.
          </p>
        </div>

        {/* === ESTIMATE AGREEMENT === */}
        <button
          id="agree-estimate"
          onClick={() => setAgreedToEstimate(!agreedToEstimate)}
          className="w-full flex items-start gap-3 p-3.5 rounded-xl transition-all active:scale-99"
          style={{ background: agreedToEstimate ? '#22C55E08' : 'hsl(220, 17%, 9%)', border: `1px solid ${agreedToEstimate ? '#22C55E30' : 'hsl(220, 17%, 14%)'}` }}
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: agreedToEstimate ? '#22C55E' : 'transparent', border: `2px solid ${agreedToEstimate ? '#22C55E' : 'hsl(220, 17%, 25%)'}` }}>
            {agreedToEstimate && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <p className="text-xs text-left" style={{ color: 'hsl(215, 20%, 55%)' }}>
            I understand that this is an <strong style={{ color: 'hsl(210, 40%, 85%)' }}>estimated price</strong> based on my entered weight ({shipmentDetails.packageWeight} kg). 
            The final price will be determined after the delivery agent measures the actual weight at pickup.
          </p>
        </button>
      </div>

      {/* === FIXED CTA === */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{ background: 'hsl(220, 17%, 5% / 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid hsl(220, 17%, 12%)' }}
      >
        <div className="max-w-md mx-auto">
          <button
            id="confirm-booking-btn"
            onClick={handleConfirm}
            disabled={!agreedToEstimate}
            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: agreedToEstimate
                ? 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                : 'hsl(220, 17%, 15%)',
              color: agreedToEstimate ? 'white' : 'hsl(215, 20%, 40%)',
              boxShadow: agreedToEstimate ? '0 8px 24px hsl(25, 100%, 54%, 0.45)' : 'none',
              fontFamily: 'Poppins, sans-serif',
              cursor: agreedToEstimate ? 'pointer' : 'not-allowed',
            }}
          >
            {paymentMethod === 'pay_after_pickup'
              ? `Confirm Booking · Est. ₹${total}`
              : `Pay & Confirm · ₹${total}`
            }
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs mt-2" style={{ color: 'hsl(215, 20%, 40%)' }}>
            {paymentMethod === 'pay_after_pickup'
              ? '💰 You\'ll pay after agent confirms weight'
              : '🔒 Secured with 256-bit encryption'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
