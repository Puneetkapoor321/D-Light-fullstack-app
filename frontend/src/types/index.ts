export interface Car {
  id: number;
  name: string;
  brand: string;
  price_per_day: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  image_url: string;
  is_available: boolean;
  status: string;
  category?: string;
  color?: string;
  description?: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  car_name: string;
  price_per_day: number;
  location: string;
  pickup_date: string;
  return_date: string;
  total_days: number;
  total_price: number;
  status: string;
  created_at?: string;
}

export interface Settings {
  id: number;
  phone: string;
  whatsapp: string;
  address: string;
}

export interface AdminStats {
  total_cars: number;
  total_bookings: number;
  pending_bookings: number;
  monthly_bookings: number;
}
