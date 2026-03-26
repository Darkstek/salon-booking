import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './config';

function PublicSearch({ onBack }) {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Veřejný endpoint - bez tokenu, proto fetch() ne fetchWithAuth()
    fetch(`${API_URL}/api/profiles/public`)
      .then(res => res.json())
      .then(data => setProfiles(data));
  }, []);

  // Filtrujeme salony podle vyhledávacího pole
  const filtered = profiles.filter(p =>
    p.business_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-6 text-center">
        <h1 className="text-3xl font-bold text-pink-300">💅 Salon Booking</h1>
        <p className="text-gray-400 mt-1">Najděte salon ve vašem okolí</p>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-10">
        <input
          type="text"
          placeholder="🔍 Hledat salon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-pink-400 bg-white shadow-sm"
        />

        {filtered.length === 0 && (
          <p className="text-center text-gray-400">Žádný salon nenalezen</p>
        )}

        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/salon/${p.id}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 mb-4 cursor-pointer hover:shadow-md hover:border-pink-200 transition"
          >
            <h2 className="text-lg font-bold text-gray-800">{p.business_name}</h2>
            {p.address && <p className="text-gray-400 text-sm mt-1">📍 {p.address}</p>}
            {p.phone && <p className="text-gray-400 text-sm">📞 {p.phone}</p>}
            {p.description && <p className="text-gray-500 text-sm mt-2">{p.description}</p>}
          </div>
        ))}

        <div className="text-center mt-8 mb-10">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 text-sm transition"
          >
            ← Zpět na přihlášení
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicSearch;