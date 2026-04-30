import { Home, Package, MessageCircle, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home',     label: 'Home',    icon: Home },
  { id: 'orders',   label: 'Orders',  icon: Package },
  { id: 'support',  label: 'Support', icon: MessageCircle },
  { id: 'settings', label: 'Profile', icon: Settings },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{
        background: 'hsl(220, 17%, 7% / 0.92)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid hsl(220, 17%, 14%)',
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 relative"
              style={{ minWidth: 64, WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Active indicator pill */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full animate-scale-in"
                  style={{
                    width: 32, height: 3,
                    background: 'linear-gradient(90deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                    borderRadius: '0 0 4px 4px',
                    top: -1,
                  }}
                />
              )}

              {/* Icon container */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, hsl(25, 100%, 54%, 0.2), hsl(38, 100%, 60%, 0.1))'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 14px hsl(25, 100%, 54%, 0.2)' : 'none',
                }}
              >
                <Icon
                  className={`transition-all duration-300 ${isActive ? 'w-5 h-5' : 'w-5 h-5'}`}
                  style={{
                    color: isActive
                      ? 'hsl(25, 100%, 54%)'
                      : 'hsl(215, 20%, 48%)',
                    strokeWidth: isActive ? 2.5 : 2,
                  }}
                />
              </div>

              <span
                className="text-[10px] font-semibold tracking-wide transition-colors duration-300"
                style={{
                  color: isActive ? 'hsl(25, 100%, 54%)' : 'hsl(215, 20%, 46%)',
                  letterSpacing: '0.04em',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
