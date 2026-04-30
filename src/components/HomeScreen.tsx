import { Search, MapPin, Bell, Package, Truck, Globe, ArrowRight, TrendingUp, Clock, Star, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HomeScreenProps {
  onSelectCourierType: (type: 'local' | 'domestic' | 'international') => void;
}

const courierTypes = [
  {
    id: 'local' as const,
    title: 'Local Courier',
    subtitle: 'Same city, same day',
    icon: Package,
    gradient: 'linear-gradient(135deg, #FF6B1A, #FF9A3C)',
    glow: 'rgba(255, 107, 26, 0.35)',
    bgAccent: 'hsl(25, 100%, 54%, 0.1)',
    badge: 'Today',
    badgeColor: '#FF6B1A',
  },
  {
    id: 'domestic' as const,
    title: 'Domestic Courier',
    subtitle: 'Pan India shipping',
    icon: Truck,
    gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
    glow: 'rgba(59, 130, 246, 0.35)',
    bgAccent: 'hsl(220, 90%, 60%, 0.1)',
    badge: '2-4 Days',
    badgeColor: '#3B82F6',
  },
  {
    id: 'international' as const,
    title: 'International',
    subtitle: 'Worldwide delivery',
    icon: Globe,
    gradient: 'linear-gradient(135deg, #8B5CF6, #C084FC)',
    glow: 'rgba(139, 92, 246, 0.35)',
    bgAccent: 'hsl(270, 80%, 60%, 0.1)',
    badge: '5-7 Days',
    badgeColor: '#8B5CF6',
  },
];

const quickStats = [
  { label: 'Deliveries', value: '12', unit: 'total', color: 'hsl(25, 100%, 54%)' },
  { label: 'On-time Rate', value: '98', unit: '%', color: 'hsl(142, 71%, 45%)' },
  { label: 'Avg. Time', value: '2.4', unit: 'hrs', color: 'hsl(38, 92%, 50%)' },
  { label: 'Saved', value: '₹840', unit: 'this month', color: 'hsl(200, 90%, 55%)' },
];

const recentActivity = [
  { id: '1', label: 'SpeedX Logistics', sub: 'Mumbai → Delhi', time: '2h ago', status: 'in_transit' },
  { id: '2', label: 'BlueDart Express', sub: 'Delhi → Bangalore', time: 'Yesterday', status: 'delivered' },
];

const statusBadge = (status: string) => {
  if (status === 'in_transit') return { text: 'In Transit', color: 'hsl(38, 92%, 50%)', bg: 'hsl(38, 92%, 50%, 0.12)' };
  if (status === 'delivered') return { text: 'Delivered', color: 'hsl(142, 71%, 45%)', bg: 'hsl(142, 71%, 45%, 0.12)' };
  return { text: status, color: 'hsl(215, 20%, 55%)', bg: 'hsl(215, 20%, 55%, 0.12)' };
};

const HomeScreen = ({ onSelectCourierType }: HomeScreenProps) => {
  const { currentUser } = useApp();
  const displayName = currentUser?.name?.split(' ')[0] || 'there';

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: 'hsl(220, 17%, 5%)' }}
    >
      {/* === STICKY HEADER === */}
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: 'hsl(220, 17%, 5% / 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Location */}
          <button
            id="location-btn"
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95"
            style={{ background: 'hsl(220, 17%, 10%)', border: '1px solid hsl(220, 17%, 16%)' }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'hsl(25, 100%, 54%, 0.2)' }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: 'hsl(25, 100%, 54%)' }} />
            </div>
            <div className="text-left">
              <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 50%)' }}>Delivering to</p>
              <p className="text-xs font-semibold" style={{ color: 'hsl(210, 40%, 96%)' }}>Mumbai, IN</p>
            </div>
          </button>

          {/* Notification bell */}
          <button
            id="notification-btn"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ background: 'hsl(220, 17%, 10%)', border: '1px solid hsl(220, 17%, 16%)' }}
          >
            <Bell className="w-5 h-5" style={{ color: 'hsl(215, 20%, 60%)' }} />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: 'hsl(25, 100%, 54%)', boxShadow: '0 0 6px hsl(25, 100%, 54%, 0.6)' }}
            />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
            style={{ color: 'hsl(215, 20%, 45%)' }}
          />
          <input
            id="search-input"
            type="text"
            placeholder="Search address, courier, or tracking ID…"
            className="w-full h-12 rounded-2xl pl-11 pr-4 text-sm transition-all duration-200 outline-none focus:ring-2"
            style={{
              background: 'hsl(220, 17%, 10%)',
              border: '1px solid hsl(220, 17%, 16%)',
              color: 'hsl(210, 40%, 96%)',
              caretColor: 'hsl(25, 100%, 54%)',
              '--tw-ring-color': 'hsl(25, 100%, 54%, 0.3)',
            } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* === HERO GREETING === */}
        <div className="pt-2 animate-slide-up">
          <p className="text-sm font-medium mb-0.5" style={{ color: 'hsl(215, 20%, 52%)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'} 👋
          </p>
          <h1
            className="text-3xl font-bold leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif', color: 'hsl(210, 40%, 96%)' }}
          >
            {displayName},{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 62%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              where to?
            </span>
          </h1>
        </div>

        {/* === PROMO BANNER === */}
        <div
          className="relative overflow-hidden rounded-2xl p-4 animate-slide-up stagger-1"
          style={{
            background: 'linear-gradient(135deg, hsl(25, 100%, 20%), hsl(38, 100%, 22%))',
            border: '1px solid hsl(25, 100%, 54%, 0.3)',
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute right-0 top-0 rounded-full"
            style={{
              width: 140, height: 140,
              background: 'radial-gradient(circle, hsl(38, 100%, 60%, 0.3) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
              filter: 'blur(20px)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2"
                style={{ background: 'hsl(25, 100%, 54%, 0.25)', border: '1px solid hsl(25, 100%, 54%, 0.4)' }}
              >
                <Zap className="w-3 h-3" style={{ color: 'hsl(38, 100%, 65%)' }} />
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'hsl(38, 100%, 65%)' }}>
                  Flash Deal
                </span>
              </div>
              <p className="text-base font-bold text-white mb-0.5">20% off local delivery</p>
              <p className="text-xs" style={{ color: 'hsl(25, 100%, 80%)' }}>Use code SWIFT20 · Ends tonight</p>
            </div>
            <button
              id="promo-cta"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                color: 'white',
                boxShadow: '0 4px 16px hsl(25, 100%, 54%, 0.45)',
              }}
              onClick={() => onSelectCourierType('local')}
            >
              Grab it
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* === COURIER TYPE CARDS === */}
        <div className="animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
              Ship Today
            </h2>
            <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>3 options</span>
          </div>
          <div className="space-y-3">
            {courierTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  id={`courier-${type.id}`}
                  onClick={() => onSelectCourierType(type.id)}
                  className={`w-full group card-hover animate-slide-up stagger-${index + 2}`}
                  style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                >
                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                      border: '1px solid hsl(220, 17%, 14%)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: type.gradient,
                        boxShadow: `0 8px 24px ${type.glow}`,
                      }}
                    >
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3
                          className="text-base font-semibold"
                          style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}
                        >
                          {type.title}
                        </h3>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${type.badgeColor}20`, color: type.badgeColor, border: `1px solid ${type.badgeColor}40` }}
                        >
                          {type.badge}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'hsl(215, 20%, 50%)' }}>
                        {type.subtitle}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-opacity-100"
                      style={{ background: 'hsl(220, 17%, 14%)' }}
                    >
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" style={{ color: 'hsl(215, 20%, 55%)' }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* === QUICK STATS GRID === */}
        <div className="animate-slide-up stagger-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
              <h2 className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
                Your Stats
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`p-4 rounded-2xl animate-scale-in stagger-${i + 1}`}
                style={{
                  background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                  border: '1px solid hsl(220, 17%, 14%)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <p
                  className="text-2xl font-black mb-1 animate-number-roll"
                  style={{ color: stat.color, fontFamily: 'Poppins, sans-serif' }}
                >
                  {stat.value}
                  <span className="text-sm font-semibold ml-1" style={{ color: stat.color, opacity: 0.7 }}>
                    {stat.unit}
                  </span>
                </p>
                <p className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* === RECENT ACTIVITY === */}
        <div className="animate-slide-up stagger-5 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
              <h2 className="text-base font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
                Recent Activity
              </h2>
            </div>
            <button style={{ color: 'hsl(25, 100%, 54%)', fontSize: 12, fontWeight: 600 }}>See all</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item) => {
              const badge = statusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-4 rounded-2xl group cursor-pointer card-hover"
                  style={{
                    background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                    border: '1px solid hsl(220, 17%, 14%)',
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'hsl(220, 17%, 14%)' }}
                  >
                    <Package className="w-5 h-5" style={{ color: 'hsl(25, 100%, 54%)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'hsl(210, 40%, 96%)' }}>
                      {item.label}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'hsl(215, 20%, 50%)' }}>
                      {item.sub}
                    </p>
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <span
                      className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.text}
                    </span>
                    <p className="text-[10px]" style={{ color: 'hsl(215, 20%, 40%)' }}>{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === TRUST BADGES === */}
        <div
          className="grid grid-cols-3 gap-2 pb-4 animate-fade-in stagger-6"
        >
          {[
            { icon: Star, label: '4.9 Rating', sub: '10k+ reviews' },
            { icon: Zap, label: 'Fast Pickup', sub: 'Within 2 hrs' },
            { icon: TrendingUp, label: 'Best Price', sub: 'Guaranteed' },
          ].map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl"
                style={{
                  background: 'hsl(220, 17%, 8%)',
                  border: '1px solid hsl(220, 17%, 13%)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(25, 100%, 54%, 0.15)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'hsl(25, 100%, 54%)' }} />
                </div>
                <p className="text-xs font-bold text-center leading-tight" style={{ color: 'hsl(210, 40%, 90%)' }}>
                  {badge.label}
                </p>
                <p className="text-[10px] text-center" style={{ color: 'hsl(215, 20%, 45%)' }}>
                  {badge.sub}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
