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
      });

    fetch(`${API_URL}/api/services/${id}`)
      .then(res => res.json())
      .then(data => setServices(data));
  }, [id]);

  if (loading) return (
    <div className="text-center mt-10 text-gray-600 text-sm tracking-wide">Načítám...</div>
  );
  if (!profile) return (
    <div className="text-center mt-10 text-gray-600 text-sm tracking-wide">Salon nenalezen</div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <div className="bg-[#0f1117] border-b border-white/5 py-6 text-center">
        <h1 className="text-xl font-medium text-white tracking-widest uppercase">Salon Booking</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8 mb-10">

        <div style={{ borderLeftColor: 'var(--accent)' }}
className="bg-[#0f1117] border border-white/5 border-l-2 rounded-lg px-4 py-3 mb-2">
          <h2 className="text-xl font-medium text-white mb-4 tracking-wide">{profile.business_name}</h2>
          {profile.phone && (
            <p className="text-gray-500 text-sm mb-2">Tel: {profile.phone}</p>
          )}
          {profile.address && (
            <p className="text-gray-500 text-sm mb-2">Adresa: {profile.address}</p>
          )}
          {profile.description && (
            <p className="text-gray-600 text-sm mt-4 border-t border-white/5 pt-4">{profile.description}</p>
          )}
        </div>

        {services.length > 0 && (
          <div className="bg-[#1a1d27] border border-white/5 rounded-xl px-6 py-6 mb-6">
            <h3 className="text-xs font-medium text-gray-600 mb-4 tracking-widest uppercase">Nabízené služby</h3>
            {services.map(s => (
              <div key={s.id} className="flex justify-between items-center border-b border-white/5 py-3 last:border-0">
                <span className="text-white text-sm">{s.name}</span>
                <div className="text-right">
                  {s.price && <span className="text-blue-400 text-sm font-medium">{s.price} Kč</span>}
                  {s.duration && <span className="text-gray-600 text-xs ml-3">{s.duration} min</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-400 text-xs transition w-full text-center tracking-wide"
        >
          Zpet na seznam salonu
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;