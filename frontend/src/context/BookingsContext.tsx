import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { Booking } from '../types';
import { API_BASE_URL } from '../config';


interface BookingsContextType {
  bookings: Booking[];
  loading: boolean;
  addBooking: (booking: any) => Promise<boolean>;
  deleteBooking: (id: number) => Promise<void>;
  updateBookingStatus: (id: number, status: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export const BookingsProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from backend on init
  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const res = await fetch(`${API_BASE_URL}/admin/bookings`, { headers });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBooking = useCallback(async (payload: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchBookings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Booking error:", err);
      return false;
    }
  }, [fetchBookings]);

  const deleteBooking = useCallback(async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      await fetchBookings();
    } catch (err) {
      console.error("Booking deletion error:", err);
      throw err;
    }
  }, [fetchBookings]);

  const updateBookingStatus = useCallback(async (id: number, status: string) => {
    try {
       const token = localStorage.getItem('token');
       const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
         method: 'PATCH',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}` 
         },
         body: JSON.stringify({ status })
       });
       if (res.ok) {
          await fetchBookings();
       } else {
          throw new Error("Failed to update booking status");
       }
    } catch (err) {
       console.error("Booking status update error:", err);
       throw err;
    }
  }, [fetchBookings]);

  const contextValue = useMemo(() => ({
    bookings, 
    loading, 
    addBooking, 
    deleteBooking, 
    updateBookingStatus,
    refreshBookings: fetchBookings
  }), [bookings, loading, addBooking, deleteBooking, updateBookingStatus, fetchBookings]);

  return (
    <BookingsContext.Provider value={contextValue}>
      {children}
    </BookingsContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingsContext);
  if (!context) throw new Error("useBookings must be used within BookingsProvider");
  return context;
};
