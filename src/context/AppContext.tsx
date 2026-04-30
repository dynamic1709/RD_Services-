import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { getCurrentUser, AuthUser } from '@/lib/auth';

export type PaymentMethod = 'pay_after_pickup' | 'advance_payment';

export interface ShipmentDetails {
  pickupAddress: string;
  destinationAddress: string;
  receiverName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  packageWeight: number;
  packageType: 'document' | 'parcel';
  courierType: 'local' | 'domestic' | 'international';
  imageEstimatedWeight?: string;   // e.g. "2–4 kg" from image scan
  packageImageUrl?: string;        // base64 data url from camera/upload
}

export interface CourierOffice {
  id: string;
  name: string;
  distance: number;
  rating: number;
  startingPrice: number;
  address: string;
  lat: number;
  lng: number;
  weightChart: WeightSlab[];
  reviews: Review[];
}

export interface WeightSlab {
  range: string;
  price: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Order {
  id: string;
  bookingId: string;
  shipmentDetails: ShipmentDetails;
  courierOffice: CourierOffice;
  selectedSlot: TimeSlot;
  status: 'confirmed' | 'agent_assigned' | 'picked_up' | 'in_transit' | 'delivered';
  price: number;                      // estimated price at booking time
  finalPrice?: number;                // actual price after on-spot weigh-in
  actualWeight?: number;              // measured by delivery agent
  paymentMethod: PaymentMethod;
  estimatedPickup: string;
  createdAt: string;
}

interface AppContextType {
  shipmentDetails: ShipmentDetails | null;
  setShipmentDetails: (details: ShipmentDetails | null) => void;
  selectedCourier: CourierOffice | null;
  setSelectedCourier: (courier: CourierOffice | null) => void;
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierOffice | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_after_pickup');
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      bookingId: 'CRX-2024-001',
      shipmentDetails: {
        pickupAddress: '123 Main St, Mumbai',
        destinationAddress: '456 Park Ave, Delhi',
        receiverName: 'John Doe',
        phone: '+91 9876543210',
        email: 'john@example.com',
        addressLine1: '456 Park Ave',
        addressLine2: 'Near Central Park',
        pincode: '110001',
        packageWeight: 1.5,
        packageType: 'parcel',
        courierType: 'domestic',
      },
      courierOffice: {
        id: '1',
        name: 'SpeedX Logistics',
        distance: 2.4,
        rating: 4.5,
        startingPrice: 99,
        address: 'Shop 12, Commerce Complex',
        lat: 19.076,
        lng: 72.877,
        weightChart: [],
        reviews: [],
      },
      selectedSlot: { id: '1', time: '10:00 - 11:00 AM', available: true },
      status: 'in_transit',
      price: 249,
      paymentMethod: 'pay_after_pickup',
      estimatedPickup: '10:30 AM',
      createdAt: '2024-01-15',
    },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
    });
  }, []);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        shipmentDetails,
        setShipmentDetails,
        selectedCourier,
        setSelectedCourier,
        selectedSlot,
        setSelectedSlot,
        currentOrder,
        setCurrentOrder,
        orders,
        addOrder,
        paymentMethod,
        setPaymentMethod,
        isLoggedIn,
        setIsLoggedIn,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
