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

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  phone: '+91 99999 00000',
  whatsapp: '+91 99999 00000',
  address: 'Mumbai, Maharashtra, India'
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setSettings(data);
          localStorage.setItem('site_settings', JSON.stringify(data));
        }
      } else {
        const saved = localStorage.getItem('site_settings');
        if (saved) setSettings(JSON.parse(saved));
      }
    } catch (err) {
      const saved = localStorage.getItem('site_settings');
      if (saved) setSettings(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
      
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        localStorage.setItem('site_settings', JSON.stringify(updated));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

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
