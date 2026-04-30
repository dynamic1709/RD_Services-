import { ArrowLeft, MapPin, Phone, Package, Check, Navigation } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface OrderTrackingProps {
  onBack: () => void;
}

const OrderTracking = ({ onBack }: OrderTrackingProps) => {
  const { currentOrder } = useApp();

  if (!currentOrder) return null;

  const statusSteps = [
    { id: 'confirmed',       label: 'Booking Confirmed', time: '10:15 AM', icon: Check },
    { id: 'agent_assigned',  label: 'Agent Assigned',    time: '10:20 AM', icon: Package },
    { id: 'picked_up',       label: 'Picked Up',         time: '10:45 AM', icon: Package },
    { id: 'in_transit',      label: 'In Transit',        time: '–',        icon: Navigation },
    { id: 'delivered',       label: 'Delivered',         time: '–',        icon: Check },
  ];

  const statusOrder = ['confirmed', 'agent_assigned', 'picked_up', 'in_transit', 'delivered'];
  const currentIdx = statusOrder.indexOf(currentOrder.status);
  const completedSteps = (id: string) => statusOrder.indexOf(id) <= currentIdx;

  return (
    <div className="min-h-screen pb-6" style={{ background: 'hsl(220, 17%, 5%)' }}>
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
            id="tracking-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Track Order
            </h1>
            <p className="text-xs font-mono" style={{ color: 'hsl(25, 100%, 54%)' }}>{currentOrder.bookingId}</p>
          </div>
        </div>
      </div>

      {/* === MAP SECTION === */}
      <div
        className="relative mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ height: 200, border: '1px solid hsl(220, 17%, 14%)' }}
      >
        {/* Dark map */}
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
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 60%, hsl(220, 17%, 5%) 100%)' }}
        />

        {/* Route SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
          <path
            d="M 50 160 Q 120 60 200 110 T 360 80"
            stroke="url(#trackRoute)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="10 5"
            className="animate-pulse"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="trackRoute" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(25, 100%, 54%)" />
              <stop offset="100%" stopColor="hsl(142, 71%, 45%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Origin pin */}
        <div className="absolute" style={{ top: '60%', left: '10%' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'hsl(25, 100%, 54%)', boxShadow: '0 0 16px hsl(25, 100%, 54%, 0.7)' }}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Courier marker (bouncing) */}
        <div className="absolute" style={{ top: '30%', left: '48%', transform: 'translate(-50%, -50%)' }}>
          <div
            className="absolute rounded-full animate-ping"
            style={{ width: 44, height: 44, background: 'hsl(38, 92%, 50%, 0.3)', top: -6, left: -6 }}
          />
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center animate-bounce-subtle"
            style={{ background: 'hsl(38, 92%, 50%)', boxShadow: '0 0 20px hsl(38, 92%, 50%, 0.6)', border: '2px solid white' }}
          >
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Destination pin */}
        <div className="absolute" style={{ top: '25%', right: '10%' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'hsl(142, 71%, 45%)', boxShadow: '0 0 16px hsl(142, 71%, 45%, 0.7)' }}
          >
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* ETA badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'hsl(220, 17%, 10% / 0.9)', border: '1px solid hsl(220, 17%, 18%)' }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(38, 92%, 50%)' }} />
          <span className="text-xs font-bold" style={{ color: 'hsl(210, 40%, 92%)' }}>ETA: 45 min</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* === AGENT CARD === */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(220, 17%, 15%)',
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white"
            style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))', boxShadow: '0 4px 16px hsl(25, 100%, 54%, 0.4)' }}
          >
            RK
          </div>
          <div className="flex-1">
            <p className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Rajesh Kumar
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(142, 71%, 45%)' }} />
              <p className="text-xs font-semibold" style={{ color: 'hsl(142, 71%, 55%)' }}>En route to pickup</p>
            </div>
          </div>
          <button
            id="call-agent-btn"
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(142, 71%, 45%, 0.15)', border: '1px solid hsl(142, 71%, 45%, 0.3)' }}
          >
            <Phone className="w-5 h-5" style={{ color: 'hsl(142, 71%, 50%)' }} />
          </button>
        </div>

        {/* === STATUS TIMELINE === */}
        <div
          className="p-4 rounded-2xl animate-slide-up stagger-1"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(220, 17%, 14%)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(215, 20%, 42%)', letterSpacing: '0.13em' }}>
            Shipment Timeline
          </p>

          {statusSteps.map((step, i) => {
            const done = completedSteps(step.id);
            const isCurrent = statusOrder.indexOf(step.id) === currentIdx;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-400 ${isCurrent ? 'animate-pulse-glow' : ''}`}
                    style={{
                      background: done
                        ? 'linear-gradient(135deg, hsl(142, 71%, 38%), hsl(160, 71%, 45%))'
                        : 'hsl(220, 17%, 14%)',
                      boxShadow: done ? '0 4px 14px hsl(142, 71%, 45%, 0.45)' : 'none',
                    }}
                  >
                    <StepIcon
                      className="w-4 h-4"
                      style={{ color: done ? 'white' : 'hsl(215, 20%, 45%)' }}
                    />
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div
                      className="w-0.5 h-10 rounded-full my-1 transition-all duration-500"
                      style={{
                        background: done
                          ? 'linear-gradient(to bottom, hsl(142, 71%, 45%), hsl(142, 71%, 35%))'
                          : 'hsl(220, 17%, 14%)',
                      }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-4 pt-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: done ? 'hsl(210, 40%, 96%)' : 'hsl(215, 20%, 42%)' }}
                  >
                    {step.label}
                    {isCurrent && (
                      <span
                        className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'hsl(38, 92%, 50%, 0.2)', color: 'hsl(38, 92%, 60%)' }}
                      >
                        CURRENT
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'hsl(215, 20%, 40%)' }}>{step.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* === DESTINATION CARD === */}
        <div
          className="flex items-start gap-4 p-4 rounded-2xl animate-slide-up stagger-2"
          style={{
            background: 'linear-gradient(135deg, hsl(142, 71%, 45%, 0.08), transparent)',
            border: '1px solid hsl(142, 71%, 45%, 0.2)',
          }}
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'hsl(142, 71%, 45%, 0.15)', border: '1px solid hsl(142, 71%, 45%, 0.25)' }}
          >
            <MapPin className="w-5 h-5" style={{ color: 'hsl(142, 71%, 50%)' }} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'hsl(142, 71%, 55%)' }}>DELIVERING TO</p>
            <p className="text-sm font-bold" style={{ color: 'hsl(210, 40%, 96%)' }}>
              {currentOrder.shipmentDetails.receiverName}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(215, 20%, 55%)' }}>
              {currentOrder.shipmentDetails.destinationAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
