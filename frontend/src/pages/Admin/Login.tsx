import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Access denied.');
      }
      
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, var(--color-accent) 0%, transparent 40%)' }}></div>
      
      <div className="bg-white p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl max-w-[320px] md:max-w-md w-full relative z-10 border border-gray-100 animate-fade-up">
        <div className="text-center mb-8 md:mb-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-[var(--color-accent)] shadow-inner">
             <ShieldCheck size={28} className="md:w-8 md:h-8" />
          </div>
          <h1 className="font-heading font-black text-2xl md:text-4xl text-gray-900 tracking-tighter uppercase">
            D&middot;LIGHT
          </h1>
          <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1 md:mt-2">Admin Panel Access</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[10px] md:text-[11px] font-black uppercase tracking-wider px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl mb-6 md:mb-8 flex items-center gap-2 md:gap-3 border border-red-100">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              required
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm"
              placeholder="e.g. admin"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:gap-2">
             <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
             <input 
               required
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               className="bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm"
               placeholder="••••••••"
             />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 md:mt-4 bg-black text-white font-black py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] hover:text-black transition-all shadow-xl hover:shadow-purple-200 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 uppercase tracking-widest text-[10px] md:text-xs"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : 'Access Dashboard'}
          </button>

          <p className="text-center text-[9px] md:text-[10px] font-bold text-gray-400 mt-1 md:mt-2 uppercase tracking-widest">
            New Admin? <Link to="/admin/register" className="text-[var(--color-accent)] font-black hover:underline underline-offset-4">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
