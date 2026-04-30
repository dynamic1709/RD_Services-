import { useState, useEffect } from 'react';
import { AppProvider, useApp, CourierOffice, Order } from '@/context/AppContext';
import { logoutUser } from '@/lib/auth';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import HomeScreen from '@/components/HomeScreen';
import ShipmentForm from '@/components/ShipmentForm';
import WeightSelection from '@/components/WeightSelection';
import SearchingScreen from '@/components/SearchingScreen';
import NearbyCouriers from '@/components/NearbyCouriers';
import CourierDetails from '@/components/CourierDetails';
import TimeSlotSelection from '@/components/TimeSlotSelection';
import OrderSummary from '@/components/OrderSummary';
import BookingSuccess from '@/components/BookingSuccess';
import OrderTracking from '@/components/OrderTracking';
import OrdersScreen from '@/components/OrdersScreen';
import SettingsScreen from '@/components/SettingsScreen';
import SupportScreen from '@/components/SupportScreen';
import BottomNav from '@/components/BottomNav';

type Screen =
  | 'splash'
  | 'login'
  | 'home'
  | 'shipment-form'
  | 'weight-selection'   // ← NEW
  | 'searching'
  | 'nearby-couriers'
  | 'courier-details'
  | 'time-slot'
  | 'order-summary'
  | 'booking-success'
  | 'order-tracking'
  | 'orders'
  | 'settings'
  | 'support';

const AppContent = () => {
  const { isLoggedIn, setIsLoggedIn, setCurrentUser, setCurrentOrder } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [courierType, setCourierType] = useState<'local' | 'domestic' | 'international'>('local');
  const [selectedCourierDetails, setSelectedCourierDetails] = useState<CourierOffice | null>(null);

  const showBottomNav = ['home', 'orders', 'settings', 'support'].includes(currentScreen);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':     setCurrentScreen('home');     break;
      case 'orders':   setCurrentScreen('orders');   break;
      case 'support':  setCurrentScreen('support');  break;
      case 'settings': setCurrentScreen('settings'); break;
    }
  };

  const handleSelectCourierType = (type: 'local' | 'domestic' | 'international') => {
    setCourierType(type);
    setCurrentScreen('shipment-form');
  };

  const handleSelectCourier = (courier: CourierOffice) => {
    setSelectedCourierDetails(courier);
    setCurrentScreen('courier-details');
  };

  const handleSelectOrder = (order: Order) => {
    setCurrentOrder(order);
    setCurrentScreen('order-tracking');
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch { /* ignore */ }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {

      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen(isLoggedIn ? 'home' : 'login')} />;

      case 'login':
        return <LoginScreen onComplete={() => setCurrentScreen('home')} />;

      case 'home':
        return <HomeScreen onSelectCourierType={handleSelectCourierType} />;

      /* ── STEP 1: SHIPMENT FORM (Addresses + Receiver) ── */
      case 'shipment-form':
        return (
          <ShipmentForm
            courierType={courierType}
            onBack={() => setCurrentScreen('home')}
            onSubmit={() => setCurrentScreen('weight-selection')}   // → weight next
          />
        );

      /* ── STEP 2: WEIGHT SELECTION (NEW) ── */
      case 'weight-selection':
        return (
          <WeightSelection
            onBack={() => setCurrentScreen('shipment-form')}
            onSubmit={() => setCurrentScreen('searching')}
          />
        );

      /* ── STEP 3: SEARCHING ── */
      case 'searching':
        return <SearchingScreen onComplete={() => setCurrentScreen('nearby-couriers')} />;

      /* ── STEP 4: NEARBY COURIERS (AI recommendation) ── */
      case 'nearby-couriers':
        return (
          <NearbyCouriers
            onBack={() => setCurrentScreen('weight-selection')}
            onSelectCourier={handleSelectCourier}
          />
        );

      /* ── STEP 5: COURIER DETAILS ── */
      case 'courier-details':
        return selectedCourierDetails ? (
          <CourierDetails
            courier={selectedCourierDetails}
            onBack={() => setCurrentScreen('nearby-couriers')}
            onSelectCourier={() => setCurrentScreen('time-slot')}
          />
        ) : null;

      /* ── STEP 6: TIME SLOT ── */
      case 'time-slot':
        return (
          <TimeSlotSelection
            onBack={() => setCurrentScreen('courier-details')}
            onConfirm={() => setCurrentScreen('order-summary')}
          />
        );

      /* ── STEP 7: ORDER SUMMARY ── */
      case 'order-summary':
        return (
          <OrderSummary
            onBack={() => setCurrentScreen('time-slot')}
            onConfirm={() => setCurrentScreen('booking-success')}
          />
        );

      /* ── STEP 8: BOOKING SUCCESS ── */
      case 'booking-success':
        return (
          <BookingSuccess
            onTrack={() => setCurrentScreen('order-tracking')}
            onGoHome={() => { setActiveTab('home'); setCurrentScreen('home'); }}
          />
        );

      case 'order-tracking':
        return <OrderTracking onBack={() => { setActiveTab('orders'); setCurrentScreen('orders'); }} />;

      case 'orders':
        return <OrdersScreen onSelectOrder={handleSelectOrder} />;

      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;

      case 'support':
        return <SupportScreen />;

      default:
        return <HomeScreen onSelectCourierType={handleSelectCourierType} />;
    }
  };

  return (
    <div className="mobile-container bg-background min-h-screen relative">
      {renderScreen()}
      {showBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default Index;
