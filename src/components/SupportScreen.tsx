import { Phone, MessageCircle, Mail, ChevronRight, HelpCircle, FileText, MessageSquare, Headphones, Zap } from 'lucide-react';

const contactOptions = [
  { icon: Phone,         label: 'Call Us',       sub: '+91 1800-123-4567', color: 'hsl(142, 71%, 45%)',  gradient: 'linear-gradient(135deg, hsl(142, 71%, 38%), hsl(160, 71%, 45%))' },
  { icon: MessageCircle, label: 'Live Chat',      sub: 'Available 24/7',   color: 'hsl(25, 100%, 54%)',  gradient: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))' },
  { icon: Mail,          label: 'Email',          sub: 'support@swiftship.in', color: 'hsl(38, 92%, 50%)', gradient: 'linear-gradient(135deg, hsl(38, 92%, 44%), hsl(48, 92%, 52%))' },
];

const faqs = [
  { q: 'How do I track my order?', a: 'Go to Orders → select your order → Track' },
  { q: 'What are the pickup hours?', a: 'Pickup is available from 9 AM to 8 PM daily' },
  { q: 'How do I cancel an order?', a: 'Contact support within 30 minutes of booking' },
  { q: 'Is my package insured?', a: 'Yes, all shipments are covered up to ₹10,000' },
  { q: 'How are prices calculated?', a: 'Prices are based on package weight and distance' },
];

const SupportScreen = () => {
  return (
    <div className="min-h-screen pb-24" style={{ background: 'hsl(220, 17%, 5%)' }}>
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
        <h1 className="text-xl font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
          Help & Support
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'hsl(215, 20%, 50%)' }}>We're here to help you 24/7</p>
      </div>

      <div className="p-4 space-y-5">
        {/* === HERO SUPPORT BANNER === */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, hsl(25, 100%, 20%), hsl(38, 100%, 22%))',
            border: '1px solid hsl(25, 100%, 54%, 0.3)',
          }}
        >
          <div
            className="absolute right-0 top-0 pointer-events-none"
            style={{
              width: 160, height: 160,
              background: 'radial-gradient(circle, hsl(38, 100%, 60%, 0.4) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
              filter: 'blur(24px)',
            }}
          />
          <div className="relative flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'hsl(25, 100%, 54%, 0.25)', border: '1px solid hsl(25, 100%, 54%, 0.4)' }}
            >
              <Headphones className="w-7 h-7" style={{ color: 'hsl(25, 100%, 75%)' }} />
            </div>
            <div>
              <p className="text-base font-bold text-white mb-0.5">24/7 Expert Support</p>
              <p className="text-xs" style={{ color: 'hsl(25, 100%, 80%)' }}>
                Average response time: <strong>2 min</strong>
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'hsl(142, 71%, 50%)' }} />
                <span className="text-[11px] font-semibold" style={{ color: 'hsl(142, 71%, 65%)' }}>
                  12 agents online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === CONTACT OPTIONS === */}
        <div className="animate-slide-up stagger-1">
          <p className="text-[10px] font-bold uppercase tracking-widest px-1 mb-3" style={{ color: 'hsl(215, 20%, 38%)', letterSpacing: '0.13em' }}>
            Contact Us
          </p>
          <div className="grid grid-cols-3 gap-3">
            {contactOptions.map(({ icon: Icon, label, sub, color, gradient }) => (
              <button
                key={label}
                id={`contact-${label.toLowerCase().replace(/\s/g, '-')}`}
                className="flex flex-col items-center gap-2, p-4 rounded-2xl transition-all duration-200 active:scale-95 card-hover"
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                  border: '1px solid hsl(220, 17%, 14%)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: gradient, boxShadow: `0 4px 14px ${color}40` }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-bold text-center" style={{ color: 'hsl(210, 40%, 90%)' }}>{label}</p>
                <p className="text-[10px] text-center" style={{ color: 'hsl(215, 20%, 45%)' }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* === FAQs === */}
        <div className="animate-slide-up stagger-2">
          <div className="flex items-center gap-2 px-1 mb-3">
            <HelpCircle className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'hsl(215, 20%, 38%)', letterSpacing: '0.13em' }}>
              FAQ
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
              border: '1px solid hsl(220, 17%, 14%)',
            }}
          >
            {faqs.map((faq, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-white/[0.03] active:bg-white/[0.06]"
                style={{ borderTop: i > 0 ? '1px solid hsl(220, 17%, 11%)' : 'none' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(25, 100%, 54%, 0.12)', border: '1px solid hsl(25, 100%, 54%, 0.2)' }}
                >
                  <MessageSquare className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: 'hsl(210, 40%, 90%)' }}>{faq.q}</p>
                  <p className="text-xs" style={{ color: 'hsl(215, 20%, 50%)' }}>{faq.a}</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'hsl(215, 20%, 38%)' }} />
              </button>
            ))}
          </div>
        </div>

        {/* === REPORT ISSUE === */}
        <div
          className="flex items-start gap-4 p-5 rounded-2xl animate-slide-up stagger-3"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(0, 84%, 60%, 0.2)',
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'hsl(0, 84%, 60%, 0.12)', border: '1px solid hsl(0, 84%, 60%, 0.2)' }}
          >
            <FileText className="w-6 h-6" style={{ color: 'hsl(0, 84%, 65%)' }} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold mb-1" style={{ color: 'hsl(210, 40%, 92%)' }}>Report an Issue</h3>
            <p className="text-xs mb-3" style={{ color: 'hsl(215, 20%, 50%)' }}>
              Having a problem? Let us resolve it quickly.
            </p>
            <button
              id="report-issue-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
              style={{
                background: 'hsl(0, 84%, 60%, 0.15)',
                color: 'hsl(0, 84%, 65%)',
                border: '1px solid hsl(0, 84%, 60%, 0.3)',
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              Report Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportScreen;
