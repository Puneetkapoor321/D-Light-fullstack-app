import { useEffect, useState } from 'react';
import { Save, Info } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import type { Settings } from '../../types';

export default function ContactSettings() {
  const { settings: globalSettings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings>(globalSettings);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Sync local data with global when global is loaded
  useEffect(() => {
    setLocalSettings(globalSettings);
  }, [globalSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const success = await updateSettings(localSettings);
      if (!success) throw new Error('Update failed');
      
      setMsg('Settings saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-14 max-w-5xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-10 text-left">
        <div>
          <h1 className="font-heading font-black text-xl md:text-3xl tracking-tighter uppercase mb-1 md:mb-2 text-gray-900">Configurations</h1>
        </div>
      </div>
      
      <div className="relative group/card">
        {/* Main Configuration Card with Static Premium Glow System */}
        <div className="
          bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-14 relative overflow-hidden z-10 
          backdrop-blur-sm bg-white/95 transition-all duration-500
          border border-gray-100 md:border-[rgba(250,204,21,0.2)]
          hover:md:border-[#facc15] hover:md:shadow-[0_0_30px_rgba(250,204,21,0.15)]
        ">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-purple-50 rounded-bl-[3rem] md:rounded-bl-[5rem] -mr-12 -mt-12 md:-mr-20 md:-mt-20 opacity-40"></div>
          
          {msg && (
            <div className={`mb-6 md:mb-10 p-3 md:p-5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 animate-in slide-in-from-top-2 duration-300 ${msg.includes('success') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              <Info size={14} className="md:w-5 md:h-5" />
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
              <div className="flex flex-col gap-1.5 md:gap-3">
                <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Displayed Phone Number</label>
                <input 
                  type="text" 
                  value={localSettings.phone} 
                  onChange={e => setLocalSettings({...localSettings, phone: e.target.value})} 
                  className="bg-gray-50/50 border border-gray-100 focus:border-[#facc15] focus:ring-4 focus:ring-[#facc15]/10 focus:bg-white px-5 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-base text-gray-900" 
                  placeholder="+91 XXXXX XXXXX"
                />
                <span className="text-[8px] md:text-[10px] text-gray-300 font-medium px-1 leading-relaxed italic">Publicly visible contact line for direct inquiries.</span>
              </div>

              <div className="flex flex-col gap-1.5 md:gap-3">
                <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Connect on WhatsApp</label>
                <input 
                  type="text" 
                  value={localSettings.whatsapp} 
                  onChange={e => setLocalSettings({...localSettings, whatsapp: e.target.value})} 
                  className="bg-gray-50/50 border border-gray-100 focus:border-[#facc15] focus:ring-4 focus:ring-[#facc15]/10 focus:bg-white px-5 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-base text-gray-900" 
                  placeholder="+91 XXXXX XXXXX"
                />
                <span className="text-[8px] md:text-[10px] text-gray-300 font-medium px-1 leading-relaxed italic">Target endpoint for instant booking verification.</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:gap-3">
              <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Headquarters Address</label>
              <textarea 
                value={localSettings.address} 
                rows={3}
                onChange={e => setLocalSettings({...localSettings, address: e.target.value})} 
                className="bg-gray-50/50 border border-gray-100 focus:border-[#facc15] focus:ring-4 focus:ring-[#facc15]/10 focus:bg-white px-5 py-3 md:px-8 md:py-6 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-base text-gray-900 resize-none leading-relaxed" 
                placeholder="Enter full physical address details"
              />
              <span className="text-[8px] md:text-[10px] text-gray-300 font-medium px-1 leading-relaxed italic">Synchronized with site footer and location services.</span>
            </div>

            <div className="flex justify-end pt-2 md:pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto bg-black text-white px-10 md:px-14 py-4 md:py-6 rounded-xl md:rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase text-[9px] md:text-xs tracking-[0.2em] hover:bg-[#facc15] hover:text-black hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-[#facc15]/40 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    SAVING DATA...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
