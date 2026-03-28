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

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      // Public users don't usually fetch all bookings, but admins do.
      if (!token) {
        setLoading(false);
        return;
      }
      
      const res = await fetch(`${API_BASE_URL}/admin/bookings`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
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
        // If an admin is booking (rare), refresh their list
        if (localStorage.getItem('token')) await fetchBookings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Booking error:", err);
      return false;
    }
  }, [fetchBookings]);

  const deleteBooking = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Delete failed");
      
      // Optimistic update
      setBookings(prev => prev.filter(b => b.id !== id));
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
          // Optimistic update
          setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
          await fetchBookings();
       } else {
          throw new Error("Status update failed");
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
