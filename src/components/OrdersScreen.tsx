import { useState } from 'react';
import { Package, Clock, CheckCircle, MapPin, ChevronRight, Search } from 'lucide-react';
import { useApp, Order } from '@/context/AppContext';

interface OrdersScreenProps {
  onSelectOrder: (order: Order) => void;
}

const getStatusConfig = (status: Order['status']) => {
  switch (status) {
    case 'confirmed':      return { label: 'Confirmed',      color: 'hsl(25, 100%, 54%)',   bg: 'hsl(25, 100%, 54%, 0.12)',   dot: 'hsl(25, 100%, 54%)'   };
    case 'agent_assigned': return { label: 'Agent Assigned', color: 'hsl(38, 92%, 50%)',    bg: 'hsl(38, 92%, 50%, 0.12)',    dot: 'hsl(38, 92%, 50%)'    };
    case 'picked_up':      return { label: 'Picked Up',      color: 'hsl(200, 90%, 55%)',   bg: 'hsl(200, 90%, 55%, 0.12)',   dot: 'hsl(200, 90%, 55%)'   };
    case 'in_transit':     return { label: 'In Transit',     color: 'hsl(38, 92%, 50%)',    bg: 'hsl(38, 92%, 50%, 0.12)',    dot: 'hsl(38, 92%, 50%)'    };
    case 'delivered':      return { label: 'Delivered',      color: 'hsl(142, 71%, 45%)',   bg: 'hsl(142, 71%, 45%, 0.12)',   dot: 'hsl(142, 71%, 45%)'   };
  }
};

const EmptyState = ({ type }: { type: 'active' | 'past' }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div
      className="w-24 h-24 rounded-3xl flex items-center justify-center mb-5 animate-float"
      style={{ background: 'hsl(220, 17%, 10%)', border: '1px solid hsl(220, 17%, 16%)' }}
    >
      <Package className="w-12 h-12" style={{ color: 'hsl(215, 20%, 40%)' }} />
    </div>
    <h3 className="text-lg font-bold mb-1" style={{ color: 'hsl(210, 40%, 80%)', fontFamily: 'Poppins, sans-serif' }}>
      No {type === 'active' ? 'active' : 'past'} orders
    </h3>
    <p className="text-sm text-center" style={{ color: 'hsl(215, 20%, 45%)', maxWidth: 220 }}>
      {type === 'active'
        ? 'Book a courier to get started'
        : 'Your completed deliveries will appear here'}
    </p>
  </div>
);

const OrdersScreen = ({ onSelectOrder }: OrdersScreenProps) => {
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders   = orders.filter((o) => o.status === 'delivered');
  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold" style={{ color: 'hsl(210, 40%, 96%)', fontFamily: 'Poppins, sans-serif' }}>
            My Orders
          </h1>
          <button
            id="search-orders"
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'hsl(220, 17%, 12%)', border: '1px solid hsl(220, 17%, 18%)' }}
          >
            <Search className="w-4.5 h-4.5" style={{ color: 'hsl(215, 20%, 55%)' }} />
          </button>
        </div>

        {/* Tab toggle */}
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: 'hsl(220, 17%, 9%)', border: '1px solid hsl(220, 17%, 13%)' }}
        >
          {[
            { id: 'active' as const, label: 'Active', count: activeOrders.length, icon: Clock },
            { id: 'past'   as const, label: 'Delivered', count: pastOrders.length, icon: CheckCircle },
          ].map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              id={`orders-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeTab === id
                  ? 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))'
                  : 'transparent',
                color: activeTab === id ? 'white' : 'hsl(215, 20%, 50%)',
                boxShadow: activeTab === id ? '0 4px 14px hsl(25, 100%, 54%, 0.35)' : 'none',
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span
                className="ml-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeTab === id ? 'rgba(255,255,255,0.25)' : 'hsl(220, 17%, 15%)',
                  color: activeTab === id ? 'white' : 'hsl(215, 20%, 50%)',
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* === ORDERS LIST === */}
      <div className="px-4 pt-4 space-y-3">
        {displayOrders.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          displayOrders.map((order, index) => {
            const { label, color, bg, dot } = getStatusConfig(order.status)!;
            return (
              <button
                key={order.id}
                id={`order-card-${order.id}`}
                onClick={() => onSelectOrder(order)}
                className={`w-full text-left card-hover animate-slide-up`}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div
                  className="p-4 rounded-2xl group"
                  style={{
                    background: 'linear-gradient(135deg, hsl(220, 17%, 9%), hsl(220, 17%, 7%))',
                    border: '1px solid hsl(220, 17%, 14%)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p
                        className="text-sm font-black font-mono tracking-wider"
                        style={{ color: 'hsl(210, 40%, 96%)' }}
                      >
                        {order.bookingId}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dot }} />
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: bg, color }}
                        >
                          {label}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: 'hsl(215, 20%, 40%)' }}
                    />
                  </div>

                  {/* Route */}
                  <div className="flex gap-3 mb-3">
                    <div className="flex flex-col items-center pt-1 gap-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(25, 100%, 54%)' }} />
                      <div className="w-0.5 h-4 rounded-full" style={{ background: 'linear-gradient(to bottom, hsl(25, 100%, 54%), hsl(142, 71%, 45%))' }} />
                      <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(142, 71%, 45%)' }} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs truncate" style={{ color: 'hsl(215, 20%, 60%)', maxWidth: 220 }}>
                        {order.shipmentDetails.pickupAddress || 'Current Location'}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'hsl(215, 20%, 60%)', maxWidth: 220 }}>
                        {order.shipmentDetails.destinationAddress}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid hsl(220, 17%, 12%)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: 'hsl(220, 17%, 13%)' }}
                      >
                        <Package className="w-3.5 h-3.5" style={{ color: 'hsl(215, 20%, 55%)' }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: 'hsl(215, 20%, 55%)' }}>
                        {order.courierOffice.name}
                      </span>
                    </div>
                    <span
                      className="text-base font-black"
                      style={{
                        background: 'linear-gradient(135deg, hsl(25, 100%, 54%), hsl(38, 100%, 60%))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      ₹{order.price}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrdersScreen;
