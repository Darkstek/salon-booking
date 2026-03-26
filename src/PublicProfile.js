import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from './config';

function PublicProfile() {
  const { id } = useParams(); // 👈 vytáhne ID z URL např. /salon/3 → id = "3"
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Načteme profil salonu
    fetch(`${API_URL}/api/profiles/public`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProfile(found);
        setLoading(false);
      });

    // Načteme služby salonu
    fetch(`${API_URL}/api/services/${id}`)
      .then(res => res.json())
      .then(data => setServices(data));
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-gray-400">Načítám...</div>;
  if (!profile) return <div className="text-center mt-10 text-gray-400">Salon nenalezen</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 py-6 text-center">
        <h1 className="text-3xl font-bold text-pink-300">💅 Salon Booking</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-10 mb-10">
        {/* Info o salonu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{profile.business_name}</h2>
          {profile.phone && (
            <p className="text-gray-500 mb-2">📞 {profile.phone}</p>
          )}
          {profile.address && (
            <p className="text-gray-500 mb-2">📍 {profile.address}</p>
          )}
          {profile.description && (
            <p className="text-gray-500 mt-4 border-t border-gray-100 pt-4">{profile.description}</p>
          )}
        </div>

        {/* Služby salonu */}
        {services.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Nabízené služby</h3>
            {services.map(s => (
              <div key={s.id} className="flex justify-between items-center border-b border-gray-50 py-3 last:border-0">
                <span className="text-gray-700 font-medium">{s.name}</span>
                <div className="text-right">
                  {s.price && <span className="text-pink-400 font-bold">{s.price} Kč</span>}
                  {s.duration && <span className="text-gray-400 text-sm ml-3">{s.duration} min</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 text-sm transition w-full text-center"
        >
          ← Zpět na seznam salonů
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;