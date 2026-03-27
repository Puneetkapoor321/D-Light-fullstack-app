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
      if (!res.ok) throw new Error('Failed to fetch cars from API');
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]); // Ensure it's empty on failure to prevent mock data
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
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE_URL}/admin/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCarData)
      });

      if (!res.ok) throw new Error('Create failed');
      await refreshCars(); // Automatically refresh after adding
    } catch (e) {
      console.error('Failed to add car:', e);
      throw e;
    }
  }, [refreshCars]);

  const updateCar = useCallback(async (id: number, updatedCar: Car) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

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
      console.error('Failed to update car:', e);
      throw e;
    }
  }, [refreshCars]);

  const deleteCar = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE_URL}/admin/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');
      await refreshCars();
    } catch (e) {
      console.error('Failed to delete car:', e);
      throw e;
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
