import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function Profile() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setBusinessName(data.business_name || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
          setDescription(data.description || '');
        }
        setLoading(false);
      });

    fetchWithAuth(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(profile => {
        if (profile?.user_id) {
          fetch(`${API_URL}/api/services/${profile.user_id}`)
            .then(res => res.json())
            .then(data => setServices(data));
        }
      });
  }, []);

  const handleSubmit = async () => {
    const response = await fetchWithAuth(`${API_URL}/api/profile`, {
      method: 'POST',
      body: JSON.stringify({
        business_name: businessName,
        phone,
        address,
        description
      }),
    });

    if (response.ok) {
      toast.success('Profil uložen!');
    } else {
      toast.error('Něco se pokazilo');
    }
  };

  const handleAddService = async () => {
    if (!serviceName) return;

    const response = await fetchWithAuth(`${API_URL}/api/services`, {
      method: 'POST',
      body: JSON.stringify({
        name: serviceName,
        price: servicePrice ? parseInt(servicePrice) : null,
        duration: serviceDuration ? parseInt(serviceDuration) : null,
      }),
    });

    const newService = await response.json();
    setServices([...services, newService]);
    setServiceName('');
    setServicePrice('');
    setServiceDuration('');
    toast.success('Služba přidána!');
  };

  const handleDeleteService = async (id) => {
    await fetchWithAuth(`${API_URL}/api/services/${id}`, {
      method: 'DELETE',
    });
    setServices(services.filter(s => s.id !== id));
    toast.success('Služba smazána!');
  };

  if (loading) return (
    <div className="text-center mt-10 text-gray-600 tracking-wide text-sm">Načítám...</div>
  );

  return (
    <div className="max-w-xl mx-auto mt-6 bg-[#1a1d27] border border-white/5 rounded-2xl p-8 mb-6">
      <h2 className="text-xl font-medium text-white mb-6 tracking-widest uppercase">Můj profil</h2>

      <input
        type="text"
        placeholder="Název podniku"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />
      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />
      <input
        type="text"
        placeholder="Adresa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />
      <textarea
        placeholder="Popis (co nabízíte, otevírací doba...)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500/50 text-sm"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg w-full transition tracking-wide text-sm mb-10"
      >
        Uložit profil
      </button>

      <h2 className="text-xl font-medium text-white mb-6 tracking-widest uppercase">Moje služby</h2>

      <input
        type="text"
        placeholder="Název služby (např. Pedikúra)"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Cena (Kč)"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/50 text-sm"
        />
        <input
          type="number"
          placeholder="Délka (min)"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/50 text-sm"
        />
      </div>
      <button
        onClick={handleAddService}
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg w-full transition tracking-wide text-sm mb-6"
      >
        Přidat službu
      </button>

      <ul>
        {services.map(s => (
          <li key={s.id} className="flex justify-between items-center bg-[#0f1117] border border-white/5 border-l-2 border-l-blue-500 rounded-lg px-4 py-3 mb-2">
            <div>
              <div className="font-medium text-white text-sm">{s.name}</div>
              <div className="text-gray-600 text-xs">
                {s.price && `${s.price} Kč`} {s.duration && `· ${s.duration} min`}
              </div>
            </div>
            <button
              onClick={() => handleDeleteService(s.id)}
              className="text-gray-700 hover:text-red-400 text-xs transition ml-4"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>

      {/* Theme picker */}
      <div className="mt-10">
        <h2 className="text-xl font-medium text-white mb-6 tracking-widest uppercase">Vzhled</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'green', label: 'Default', color: '#4ade80' },
            { id: 'blue', label: 'Blue', color: '#3b82f6' },
            { id: 'pink', label: 'Pink', color: '#f472b6' },
            { id: 'cyberpunk', label: 'Cyberpunk', color: '#fcee0a' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              style={{
                borderColor: theme === t.id ? t.color : 'rgba(255,255,255,0.05)',
                color: theme === t.id ? t.color : '#444',
                backgroundColor: theme === t.id ? `${t.color}15` : 'transparent',
              }}
              className="border rounded-lg py-3 px-4 text-sm tracking-wide transition text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: t.color }}
                  className="w-3 h-3 rounded-full"
                />
                {t.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;