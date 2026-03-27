import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import API_URL from './config';

function Login({ onLogin, onGuest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      toast.success('Přihlášení úspěšné!');
      onLogin();
    } else {
      toast.error(data.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      toast.success('Přihlášení přes Google úspěšné!');
      onLogin();
    } else {
      toast.error('Google přihlášení selhalo');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-[#1a1d27] border border-white/5 rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-medium text-white mb-2 tracking-widest uppercase">Salon Booking</h1>
          <p className="text-gray-600 mb-8 text-sm tracking-wide">Přihlaste se pro správu salonu</p>

        <div className="mb-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google přihlášení selhalo')}
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">nebo</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
        />

        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg w-full transition mb-4 tracking-wide text-sm"
        >
          Přihlásit se
        </button>

    
        <div className="border-t border-white/5 pt-4 mt-2">
  <p className="text-center text-gray-600 text-xs mb-3 tracking-wide">Hledáte salon?</p>
  <button onClick={onGuest} className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 px-6 rounded-lg transition text-sm tracking-wide">
    Hledat salon
  </button>
</div>
       

      </div>
    </div>
  );
}

export default Login;