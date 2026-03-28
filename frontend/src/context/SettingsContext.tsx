import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { Settings } from '../types';
import { API_BASE_URL } from '../config';

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define standard fallback to prevent flashing of empty fields
const DEFAULT_SETTINGS: Settings = {
  id: 1,
  phone: '+91 8307607971',
  whatsapp: '+91 8307607971',
  address: 'Baba Mastnath University, Gate No. 4, Asthal Bohar - Rohtak'
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Centralized fetch function for settings
  const fetchSettings = useCallback(async () => {
    try {
      // Add a timestamp for cache busting just in case of aggressive CDNs
      const res = await fetch(`${API_BASE_URL}/settings?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setSettings(data);
          // Persist for offline/loading experience
          localStorage.setItem('site_settings', JSON.stringify(data));
        }
      } else {
        // Fallback to local storage if API fails
        const saved = localStorage.getItem('site_settings');
        if (saved) setSettings(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
      const saved = localStorage.getItem('site_settings');
      if (saved) setSettings(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
      
      if (res.ok) {
        // OPTIMISTIC UPDATE: Set local state immediately
        const updated = await res.json();
        setSettings(updated);
        localStorage.setItem('site_settings', JSON.stringify(updated));
        
        // Final sync
        await fetchSettings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Settings update error:", err);
      return false;
    }
  }, [fetchSettings]);

  const value = useMemo(() => ({
    settings,
    loading,
    updateSettings,
    refreshSettings: fetchSettings
  }), [settings, loading, updateSettings, fetchSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
