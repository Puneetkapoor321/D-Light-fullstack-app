import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed');
      }
      
      navigate('/admin/login');
    } catch (err: any) {
      setError(err.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, var(--color-accent) 0%, transparent 40%)' }}></div>
      
      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-md w-full relative z-10 border border-gray-100 animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--color-accent)] shadow-inner">
             <ShieldCheck size={32} />
          </div>
          <h1 className="font-heading font-black text-4xl text-gray-900 tracking-tighter uppercase">
            REGISTRATION
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">D&middot;LIGHT Car Rental Admin</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-wider px-5 py-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              required
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-sm"
              placeholder="e.g. admin"
            />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
             <input 
               required
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               className="bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-sm"
               placeholder="••••••••"
             />
          </div>
          <div className="flex flex-col gap-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
             <input 
               required
               type="password" 
               value={confirmPassword} 
               onChange={e => setConfirmPassword(e.target.value)} 
               className="bg-gray-50 border border-transparent focus:border-purple-200 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-sm"
               placeholder="••••••••"
             />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-4 bg-black text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] hover:text-black transition-all shadow-xl hover:shadow-purple-200 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 uppercase tracking-widest text-xs"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : 'Create Admin Account'}
          </button>

          <p className="text-center text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
            Already have an account? <Link to="/admin/login" className="text-[var(--color-accent)] font-black hover:underline underline-offset-4">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
