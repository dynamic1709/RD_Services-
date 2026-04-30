import { useState } from 'react';
import { ArrowLeft, Clock, Check, Calendar } from 'lucide-react';
import { useApp, TimeSlot } from '@/context/AppContext';

interface TimeSlotSelectionProps {
  onBack: () => void;
  onConfirm: () => void;
}

const timeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 - 10:00 AM',  available: true  },
  { id: '2', time: '10:00 - 11:00 AM', available: true  },
  { id: '3', time: '11:00 AM - 12 PM', available: true  },
  { id: '4', time: '12:00 - 1:00 PM',  available: false },
  { id: '5', time: '2:00 - 3:00 PM',   available: true  },
  { id: '6', time: '3:00 - 4:00 PM',   available: true  },
  { id: '7', time: '4:00 - 5:00 PM',   available: true  },
  { id: '8', time: '5:00 - 6:00 PM',   available: false },
];

const TimeSlotSelection = ({ onBack, onConfirm }: TimeSlotSelectionProps) => {
  const { setSelectedSlot } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    const slot = timeSlots.find((s) => s.id === selected);
    if (slot) { setSelectedSlot(slot); onConfirm(); }
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

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
            id="timeslot-back"
            onClick={onBack}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(210, 40%, 92%)' }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Pick a Time Slot
            </h1>
            <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>Select your preferred pickup window</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* === DATE CARD === */}
        <div
          className="flex items-center gap-4 p-4 rounded-2xl animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, hsl(25, 100%, 54%, 0.15), hsl(38, 100%, 60%, 0.08))',
            border: '1px solid hsl(25, 100%, 54%, 0.3)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))', boxShadow: '0 4px 16px hsl(25, 100%, 54%, 0.4)' }}
          >
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'hsl(25, 100%, 70%)' }}>Pickup Date</p>
            <p className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Today · {today}
            </p>
          </div>
        </div>

        {/* === SLOTS GRID === */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
            <h2 className="text-sm font-bold" style={{ color: 'hsl(215, 20%, 70%)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11 }}>
              Available Slots
            </h2>
            <span
              className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'hsl(142, 71%, 45%, 0.15)', color: 'hsl(142, 71%, 50%)', border: '1px solid hsl(142, 71%, 45%, 0.3)' }}
            >
              {timeSlots.filter(s => s.available).length} Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot, index) => {
              const isSelected = selected === slot.id;
              return (
                <button
                  key={slot.id}
                  id={`slot-${slot.id}`}
                  disabled={!slot.available}
                  onClick={() => setSelected(slot.id)}
                  className={`relative p-4 rounded-2xl transition-all duration-300 text-left animate-slide-up ${
                    !slot.available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-97'
                  }`}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    background: isSelected
                      ? 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                      : 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                    border: isSelected
                      ? '1.5px solid transparent'
                      : '1.5px solid hsl(220, 17%, 15%)',
                    boxShadow: isSelected
                      ? '0 8px 24px hsl(25, 100%, 54%, 0.45), 0 0 0 1px hsl(25, 100%, 54%, 0.3)'
                      : 'var(--shadow-card)',
                  }}
                >
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center animate-scale-in"
                      style={{ background: 'rgba(255,255,255,0.25)' }}
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'hsl(25, 100%, 54%)' }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{ color: isSelected ? 'white' : 'hsl(210, 40%, 90%)' }}
                    >
                      {slot.time}
                    </span>
                  </div>

                  {/* Status */}
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color: isSelected
                        ? 'rgba(255,255,255,0.75)'
                        : slot.available ? 'hsl(142, 71%, 50%)' : 'hsl(215, 20%, 40%)',
                    }}
                  >
                    {slot.available ? '● Available' : '✕ Full'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
        <div className="max-w-md mx-auto">
          <button
            id="confirm-slot-btn"
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: selected
                ? 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                : 'hsl(220, 17%, 12%)',
              color: selected ? 'white' : 'hsl(215, 20%, 40%)',
              boxShadow: selected ? '0 8px 24px hsl(25, 100%, 54%, 0.4)' : 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {selected ? 'Confirm Pickup Slot' : 'Select a Time Slot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelection;
