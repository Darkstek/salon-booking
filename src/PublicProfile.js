import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from './config';

function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/profiles/public`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProfile(found);
        setLoading(false);
        if (found?.user_id) {
          fetch(`${API_URL}/api/services/${found.user_id}`)
            .then(res => res.json())
            .then(data => setServices(data));
        }
      });
  }, [id]);

  if (loading) return (
    <div style={{ color: 'var(--text-muted)' }} className="text-center mt-10 text-sm tracking-wide">
      Načítám...
    </div>
  );
  if (!profile) return (
    <div style={{ color: 'var(--text-muted)' }} className="text-center mt-10 text-sm tracking-wide">
      Salon nenalezen
    </div>
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
          Salon Booking
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8 mb-10">

        <div
          style={{
            borderLeftColor: 'var(--accent)',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
          }}
          className="border border-l-2 px-6 py-6 mb-4"
        >
          <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-4 tracking-wide">
            {profile.business_name}
          </h2>
          {profile.phone && (
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-2">
              Tel: {profile.phone}
            </p>
          )}
          {profile.address && (
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-2">
              Adresa: {profile.address}
            </p>
          )}
          {profile.description && (
            <p style={{ color: 'var(--text-muted)', borderTopColor: 'var(--border)' }} className="text-sm mt-4 border-t pt-4">
              {profile.description}
            </p>
          )}
        </div>

        {services.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border px-6 py-6 mb-6"
          >
            <h3 style={{ color: 'var(--text-muted)' }} className="text-xs font-medium mb-4 tracking-widest uppercase">
              Nabízené služby
            </h3>
            {services.map(s => (
              <div
                key={s.id}
                style={{ borderBottomColor: 'var(--border)' }}
                className="flex justify-between items-center border-b py-3 last:border-0"
              >
                <span style={{ color: 'var(--text-primary)' }} className="text-sm">{s.name}</span>
                <div className="text-right">
                  {s.price && (
                    <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">
                      {s.price} Kč
                    </span>
                  )}
                  {s.duration && (
                    <span style={{ color: 'var(--text-muted)' }} className="text-xs ml-3">
                      {s.duration} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          style={{ color: 'var(--text-muted)' }}
          className="hover:opacity-80 text-xs transition w-full text-center tracking-wide"
        >
          Zpět na seznam salonů
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;