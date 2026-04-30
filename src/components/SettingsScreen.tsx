import { User, MapPin, HelpCircle, LogOut, ChevronRight, Bell, Shield, CreditCard, Star, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SettingsScreenProps {
  onLogout: () => void;
}

const SettingsScreen = ({ onLogout }: SettingsScreenProps) => {
  const { currentUser, orders } = useApp();

  const displayName  = currentUser?.name  || 'User';
  const displayEmail = currentUser?.email || '';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalSpent = orders.reduce((sum, o) => sum + o.price, 0);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: MapPin,     label: 'Saved Addresses',   sub: '3 saved',    badge: null,    color: 'hsl(25, 100%, 54%)'  },
        { icon: CreditCard, label: 'Payment Methods',   sub: 'UPI, Card',  badge: null,    color: 'hsl(200, 90%, 55%)' },
        { icon: Bell,       label: 'Notifications',     sub: 'All enabled', badge: '3',    color: 'hsl(38, 92%, 50%)'  },
      ],
    },
    {
      title: 'Security',
      items: [
        { icon: Shield,    label: 'Privacy & Security', sub: 'Manage',      badge: null,   color: 'hsl(142, 71%, 45%)' },
        { icon: HelpCircle, label: 'Help & Support',   sub: 'FAQ, Chat',   badge: null,   color: 'hsl(270, 80%, 65%)' },
      ],
    },
  ];

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
          Profile
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {/* === PROFILE HERO === */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, hsl(220, 17%, 10%), hsl(220, 17%, 7%))',
            border: '1px solid hsl(220, 17%, 15%)',
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute right-0 top-0 pointer-events-none"
            style={{
              width: 180, height: 180,
              background: 'radial-gradient(circle, hsl(25, 100%, 54%, 0.12) 0%, transparent 70%)',
              transform: 'translate(30%, -30%)',
              filter: 'blur(30px)',
            }}
          />

          <div className="relative flex items-center gap-4 mb-5">
            {/* Avatar */}
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={displayName}
                className="w-20 h-20 rounded-3xl object-cover"
                style={{ border: '2px solid hsl(25, 100%, 54%, 0.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                  boxShadow: '0 8px 24px hsl(25, 100%, 54%, 0.4)',
                }}
              >
                {initials || <User className="w-8 h-8" />}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2
                  className="text-xl font-bold truncate"
                  style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}
                >
                  {displayName}
                </h2>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(200, 90%, 55%, 0.2)' }}
                >
                  <Star className="w-2.5 h-2.5" style={{ color: 'hsl(200, 90%, 60%)', fill: 'hsl(200, 90%, 60%)' }} />
                </div>
              </div>
              <p className="text-sm truncate" style={{ color: 'hsl(215, 20%, 50%)' }}>{displayEmail}</p>
              <span
                className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mt-1.5"
                style={{ background: 'hsl(25, 100%, 54%, 0.15)', color: 'hsl(25, 100%, 60%)', border: '1px solid hsl(25, 100%, 54%, 0.3)' }}
              >
                ✦ Pro Member
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Orders', value: orders.length },
              { label: 'Delivered', value: deliveredCount },
              { label: 'Spent', value: `₹${totalSpent}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center py-3 rounded-2xl"
                style={{ background: 'hsl(220, 17%, 12%)' }}
              >
                <p
                  className="text-lg font-black"
                  style={{
                    background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] font-medium" style={{ color: 'hsl(215, 20%, 50%)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Edit profile */}
          <button
            id="edit-profile-btn"
            className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all active:scale-90"
            style={{ background: 'hsl(220, 17%, 14%)', border: '1px solid hsl(220, 17%, 20%)' }}
          >
            <span className="text-xs font-semibold" style={{ color: 'hsl(215, 20%, 65%)' }}>Edit</span>
          </button>
        </div>

        {/* === MENU SECTIONS === */}
        {menuSections.map((section) => (
          <div key={section.title} className="animate-slide-up stagger-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-1 mb-2"
              style={{ color: 'hsl(215, 20%, 38%)', letterSpacing: '0.13em' }}
            >
              {section.title}
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                border: '1px solid hsl(220, 17%, 14%)',
              }}
            >
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    id={`settings-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                    className="w-full flex items-center gap-4 p-4 transition-all duration-200 hover:bg-white/[0.03] active:bg-white/[0.06]"
                    style={{ borderTop: i > 0 ? '1px solid hsl(220, 17%, 12%)' : 'none' }}
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold" style={{ color: 'hsl(210, 40%, 92%)' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'hsl(215, 20%, 48%)' }}>{item.sub}</p>
                    </div>
                    {item.badge && (
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full mr-1"
                        style={{ background: 'hsl(25, 100%, 54%)', color: 'white' }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'hsl(215, 20%, 35%)' }} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* === LOGOUT === */}
        <button
          id="logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 active:scale-99 animate-slide-up stagger-2"
          style={{
            background: 'hsl(0, 84%, 60%, 0.08)',
            border: '1px solid hsl(0, 84%, 60%, 0.2)',
          }}
        >
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(0, 84%, 60%, 0.15)' }}
          >
            <LogOut className="w-5 h-5" style={{ color: 'hsl(0, 84%, 65%)' }} />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'hsl(0, 84%, 65%)' }}>
            Sign Out
          </span>
        </button>

        {/* === APP INFO === */}
        <div className="text-center py-4 animate-fade-in stagger-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))' }}
            >
              <Package className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: 'hsl(215, 20%, 50%)' }}>SwiftShip Pro</span>
          </div>
          <p className="text-xs" style={{ color: 'hsl(215, 20%, 35%)' }}>v2.0.0 · Made with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
