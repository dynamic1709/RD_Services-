import { useState } from 'react';
import { ArrowLeft, MapPin, User, Phone, Mail, ChevronRight } from 'lucide-react';
import { useApp, ShipmentDetails } from '@/context/AppContext';

interface ShipmentFormProps {
  courierType: 'local' | 'domestic' | 'international';
  onBack: () => void;
  onSubmit: () => void;
}

const typeConfig = {
  local:         { label: 'Local Shipment',         color: 'hsl(25, 100%, 54%)',   bg: 'hsl(25, 100%, 54%, 0.12)',  border: 'hsl(25, 100%, 54%, 0.3)' },
  domestic:      { label: 'Domestic Shipment',       color: 'hsl(220, 90%, 60%)',   bg: 'hsl(220, 90%, 60%, 0.12)', border: 'hsl(220, 90%, 60%, 0.3)' },
  international: { label: 'International Shipment',  color: 'hsl(270, 80%, 65%)',   bg: 'hsl(270, 80%, 65%, 0.12)', border: 'hsl(270, 80%, 65%, 0.3)' },
};

const STEPS = ['Addresses', 'Receiver'];

/* ── Focused input component ─────────────────────────────────── */
const InputField = ({
  icon: Icon, placeholder, value, onChange, type = 'text', iconColor,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  iconColor?: string;
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="relative flex items-center rounded-2xl transition-all duration-200"
      style={{
        background: 'hsl(220, 17%, 10%)',
        border: `1.5px solid ${focused ? 'hsl(25, 100%, 54%, 0.6)' : 'hsl(220, 17%, 16%)'}`,
        boxShadow: focused ? '0 0 0 4px hsl(25, 100%, 54%, 0.08)' : 'none',
      }}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon
          className="w-4 h-4"
          style={{ color: focused ? 'hsl(25, 100%, 54%)' : (iconColor ?? 'hsl(215, 20%, 45%)') }}
        />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-sm outline-none pl-11 pr-4"
        style={{ height: 52, color: 'hsl(210, 40%, 96%)', caretColor: 'hsl(25, 100%, 54%)' }}
      />
    </div>
  );
};

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="rounded-2xl p-4 space-y-3"
    style={{
      background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
      border: '1px solid hsl(220, 17%, 14%)',
    }}
  >
    {children}
  </div>
);

const ShipmentForm = ({ courierType, onBack, onSubmit }: ShipmentFormProps) => {
  const { setShipmentDetails } = useApp();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    pickupAddress: '',
    destinationAddress: '',
    receiverName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
  });

  const cfg = typeConfig[courierType];
  const update = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
    } else {
      /* Store partial details — weight/type will be filled by WeightSelection */
      const details: ShipmentDetails = {
        ...formData,
        packageWeight: 1,
        packageType: 'parcel',
        courierType,
      };
      setShipmentDetails(details);
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen pb-32" style={{ background: 'hsl(220, 17%, 5%)' }}>

      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid hsl(220, 17%, 12%)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            id="shipment-back"
            onClick={step > 0 ? () => setStep(step - 1) : onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              {cfg.label}
            </h1>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>
              Step {step + 1} of 5
            </p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
          >
            {courierType.charAt(0).toUpperCase() + courierType.slice(1)}
          </span>
        </div>

        {/* 5-step progress bar */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-all duration-400"
                style={{
                  background: s <= step + 1
                    ? 'linear-gradient(90deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                    : 'hsl(220, 17%, 15%)',
                  boxShadow: s === step + 1 ? '0 0 8px hsl(25, 100%, 54%, 0.5)' : 'none',
                }}
              />
              <p
                className="text-[9px] mt-1 font-medium"
                style={{ color: s <= step + 1 ? 'hsl(25, 100%, 54%)' : 'hsl(215, 20%, 35%)', letterSpacing: '0.02em' }}
              >
                {['Address', 'Receiver', 'Weight', 'Courier', 'Confirm'][s - 1]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 animate-slide-up">

        {/* ── STEP 0: ADDRESSES ── */}
        {step === 0 && (
          <SectionCard>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(215, 20%, 42%)', letterSpacing: '0.12em' }}>
              Pickup & Delivery
            </p>

            {/* Vertical route line visual */}
            <div className="relative">
              <div
                className="absolute left-7 top-14 w-0.5 h-6 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, hsl(25, 100%, 54%), hsl(142, 71%, 45%))' }}
              />
              <div className="space-y-3">
                <InputField
                  icon={MapPin}
                  iconColor="hsl(25, 100%, 54%)"
                  placeholder="Pickup address"
                  value={formData.pickupAddress}
                  onChange={(v) => update('pickupAddress', v)}
                />
                <InputField
                  icon={MapPin}
                  iconColor="hsl(142, 71%, 45%)"
                  placeholder="Destination address"
                  value={formData.destinationAddress}
                  onChange={(v) => update('destinationAddress', v)}
                />
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── STEP 1: RECEIVER ── */}
        {step === 1 && (
          <SectionCard>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(215, 20%, 42%)', letterSpacing: '0.12em' }}>
              Receiver Details
            </p>
            <InputField icon={User}    placeholder="Full name"              value={formData.receiverName}  onChange={(v) => update('receiverName', v)}  />
            <InputField icon={Phone}   placeholder="Phone number"           value={formData.phone}         onChange={(v) => update('phone', v)}          type="tel"   />
            <InputField icon={Mail}    placeholder="Email address"          value={formData.email}         onChange={(v) => update('email', v)}          type="email" />
            <InputField icon={MapPin}  placeholder="Address line 1"         value={formData.addressLine1}  onChange={(v) => update('addressLine1', v)}   />
            <InputField icon={MapPin}  placeholder="Address line 2 (optional)" value={formData.addressLine2} onChange={(v) => update('addressLine2', v)} />
            <InputField icon={MapPin}  placeholder="Pincode"                value={formData.pincode}       onChange={(v) => update('pincode', v)}        />
          </SectionCard>
        )}

        {/* Notice: next step */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: 'hsl(220, 17%, 9%)', border: '1px solid hsl(220, 17%, 13%)' }}
        >
          <span className="text-base">⚖️</span>
          <p className="text-xs" style={{ color: 'hsl(215, 20%, 55%)' }}>
            {step === 0
              ? 'Next: Add receiver details'
              : 'Next: Choose package weight & type'}
          </p>
        </div>
      </div>

      {/* ── FIXED CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid hsl(220, 17%, 12%)',
        }}
      >
        <div className="max-w-md mx-auto">
          <button
            id="next-step-btn"
            onClick={handleNext}
            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
              color: 'white',
              boxShadow: '0 8px 24px hsl(25, 100%, 54%, 0.4)',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {step < 1 ? 'Continue to Receiver' : 'Choose Package Weight'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentForm;
