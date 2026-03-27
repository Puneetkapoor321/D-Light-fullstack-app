import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { Car } from '../types';
import { API_BASE_URL } from '../config';

interface CarsContextType {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => Promise<void>;
  updateCar: (id: number, car: Car) => Promise<void>;
  deleteCar: (id: number) => Promise<void>;
  loading: boolean;
  refreshCars: () => Promise<void>;
  uploadCarImage: (file: File) => Promise<{ image_url: string }>;
  updateCarStatus: (id: number, status: string) => Promise<void>;
}

const CarsContext = createContext<CarsContextType | undefined>(undefined);

const FALLBACK_CARS: Car[] = [
  {
    id: 1,
    name: "Swift Performance Black",
    brand: "Maruti Suzuki",
    price_per_day: 1200,
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    image_url: "/images/cars/black-swift.png",
    is_available: true,
    status: "active",
    category: "Hatchback",
    color: "Black",
    description: "Economic and fast hatch.",
  },
  {
    id: 2,
    name: "Brezza Urban White",
    brand: "Maruti Suzuki",
    price_per_day: 1800,
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    image_url: "/images/cars/white-brezza.png",
    is_available: true,
    status: "active",
    category: "SUV",
    color: "White",
    description: "Compact SUV for all roads.",
  },
  {
    id: 3,
    name: "Nexon Tech Grey",
    brand: "Tata",
    price_per_day: 1900,
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    image_url: "/images/cars/grey-nexon.png",
    is_available: true,
    status: "active",
    category: "SUV",
    color: "Grey",
    description: "Safe and strong for city.",
  },
  {
    id: 4,
    name: "BMW M4 Competition",
    brand: "BMW",
    price_per_day: 4500,
    fuel_type: "Petrol",
    transmission: "Automatic",
    seats: 4,
    image_url: "/images/cars/bmw-m4.png",
    is_available: true,
    status: "active",
    category: "Luxury",
    color: "Dark Grey",
    description: "The ultimate driving machine.",
  },
  {
    id: 5,
    name: "Audi RS6 Avant",
    brand: "Audi",
    price_per_day: 5200,
    fuel_type: "Petrol",
    transmission: "Automatic",
    seats: 5,
    image_url: "/images/cars/audi-rs6.png",
    is_available: true,
    status: "active",
    category: "Performance",
    color: "Red",
    description: "Sleek, fast, and practical.",
  },
  {
    id: 6,
    name: "Mercedes G-Wagon",
    brand: "Mercedes-Benz",
    price_per_day: 7500,
    fuel_type: "Diesel",
    transmission: "Automatic",
    seats: 5,
    image_url: "/images/cars/mercedes-g.png",
    is_available: true,
    status: "active",
    category: "Luxury SUV",
    color: "Black",
    description: "The king of all terrains.",
  },
];

export const CarsProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCars = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = token ? `${API_BASE_URL}/admin/cars` : `${API_BASE_URL}/cars`;
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCars(data.length > 0 ? data : FALLBACK_CARS);
      localStorage.setItem("carsData", JSON.stringify(data.length > 0 ? data : FALLBACK_CARS));
    } catch (error) {
      console.error('Error fetching cars:', error);
      const saved = localStorage.getItem("carsData");
      if (saved) {
        setCars(JSON.parse(saved));
      } else {
        setCars(FALLBACK_CARS);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Initial Load
  useEffect(() => {
    refreshCars();
  }, [refreshCars]);

  const addCar = useCallback(async (newCarData: Omit<Car, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback for non-admin or no backend
        const newCar = { ...newCarData, id: Date.now() } as Car;
        setCars(prev => [...prev, newCar]);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/admin/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCarData)
      });

      if (!res.ok) throw new Error('Create failed');
      await refreshCars();
    } catch (e) {
      console.error(e);
      // Fallback
      const newCar = { ...newCarData, id: Date.now() } as Car;
      setCars(prev => [...prev, newCar]);
    }
  }, [refreshCars]);

  const updateCar = useCallback(async (id: number, updatedCar: Car) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCars(prev => prev.map(c => c.id === id ? updatedCar : c));
        return;
      }

      const res = await fetch(`${API_BASE_URL}/admin/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedCar)
      });

      if (!res.ok) throw new Error('Update failed');
      await refreshCars();
    } catch (e) {
      console.error(e);
      setCars(prev => prev.map(c => c.id === id ? updatedCar : c));
    }
  }, [refreshCars]);

  const deleteCar = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCars(prev => prev.filter(c => c.id !== id));
        return;
      }

      const res = await fetch(`${API_BASE_URL}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');
      await refreshCars();
    } catch (e) {
      console.error(e);
      setCars(prev => prev.filter(c => c.id !== id));
    }
  }, [refreshCars]);

  const uploadCarImage = useCallback(async (file: File) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/admin/cars/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }
      return await res.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);

  const updateCarStatus = useCallback(async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE_URL}/admin/cars/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error('Status update failed');
      await refreshCars();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, [refreshCars]);

  const value = useMemo(() => ({
    cars, addCar, updateCar, deleteCar, loading, refreshCars, uploadCarImage, updateCarStatus
  }), [cars, addCar, updateCar, deleteCar, loading, refreshCars, uploadCarImage, updateCarStatus]);

  return (
    <CarsContext.Provider value={value}>
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) throw new Error("useCars must be used within CarsProvider");
  return context;
};
