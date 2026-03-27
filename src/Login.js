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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Salon Booking</h1>
        <p className="text-gray-400 mb-8">Přihlaste se pro správu salonu</p>

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
          className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
        />

        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-pink-400"
        />

        <button
          onClick={handleSubmit}
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition mb-4"
        >
          Přihlásit se
        </button>

    
        <div className="border-t border-gray-100 pt-4 mt-2">
          <p className="text-center text-gray-400 text-sm mb-3">Hledáte salon?</p>
          <button
            onClick={onGuest}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            🔍 Hledat salon
          </button>
        </div>
       

      </div>
    </div>
  );
}

export default Login;