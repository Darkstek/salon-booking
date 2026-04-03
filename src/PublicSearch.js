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
    <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen">
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
        }}
        className="py-6 text-center"
      >
        <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium tracking-widest uppercase">
          Zerio
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1 text-xs tracking-wider">
          Najděte salon ve vašem okolí
        </p>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8">
        <input
          type="text"
          placeholder="Hledat salon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-sm)',
          }}
          className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
        />

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }} className="text-center text-sm">
            Žádný salon nenalezen
          </p>
        )}

        {filtered.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/salon/${p.id}`)}
            style={{
              borderLeftColor: 'var(--accent)',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            className="border border-l-2 px-5 py-4 mb-3 hover:opacity-80 transition"
          >
            <h2 style={{ color: 'var(--text-primary)' }} className="text-base font-medium mb-2">
              {p.business_name}
            </h2>
            {p.address && (
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mb-1">
                Adresa: {p.address}
              </p>
            )}
            {p.phone && (
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mb-1">
                Tel: {p.phone}
              </p>
            )}
            {p.description && (
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-2">
                {p.description}
              </p>
            )}
          </div>
        ))}

        <div className="text-center mt-8 mb-10">
          <button
            onClick={onBack}
            style={{ color: 'var(--text-muted)' }}
            className="hover:opacity-80 text-xs transition tracking-wide"
          >
            Zpět na přihlášení
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicSearch;