import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './config';

function PublicSearch({ onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/profiles/public`)
      .then(res => res.json())
      .then(data => setProfiles(data));
  }, []);

  const filtered = profiles.filter(p =>
    p.business_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="bg-[#0f1117] border-b border-white/5 py-6 text-center">
        <h1 className="text-xl font-medium text-white tracking-widest uppercase">Salon Booking</h1>
        <p className="text-gray-600 mt-1 text-xs tracking-wider">Najděte salon ve vašem okolí</p>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8">
        <input
          type="text"
          placeholder="Hledat salon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-white/10 bg-[#1a1d27] text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500/50 text-sm"
        />

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 text-sm">Žádný salon nenalezen</p>
        )}

        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/salon/${p.id}`)}
            style={{ borderLeftColor: 'var(--accent)' }}
            className="bg-[#0f1117] border border-white/5 border-l-2 rounded-lg px-4 py-3 mb-2"
          >
            <h2 className="text-base font-medium text-white mb-2">{p.business_name}</h2>
            {p.address && <p className="text-gray-600 text-xs mb-1">Adresa: {p.address}</p>}
            {p.phone && <p className="text-gray-600 text-xs mb-1">Tel: {p.phone}</p>}
            {p.description && <p className="text-gray-500 text-xs mt-2">{p.description}</p>}
          </div>
        ))}

        <div className="text-center mt-8 mb-10">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-400 text-xs transition tracking-wide"
          >
            Zpet na prihlaseni
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicSearch;