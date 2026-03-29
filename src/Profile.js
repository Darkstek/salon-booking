import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function Profile({ onThemeChange, theme, onModeChange, mode }) {
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
      body: JSON.stringify({ business_name: businessName, phone, address, description }),
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
    await fetchWithAuth(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
    setServices(services.filter(s => s.id !== id));
    toast.success('Služba smazána!');
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
  };

  const btnStyle = {
    backgroundColor: 'var(--accent)',
    borderRadius: 'var(--radius-sm)',
    clipPath: 'var(--btn-clip)',
  };

  if (loading) return (
    <div style={{ color: 'var(--text-muted)' }} className="text-center mt-10 tracking-wide text-sm">
      Načítám...
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius)',
      }}
      className="max-w-xl mx-auto mt-6 border p-8 mb-6"
    >
      <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-6 tracking-widest uppercase">
        Můj profil
      </h2>

      <input
        type="text"
        placeholder="Název podniku"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <input
        type="text"
        placeholder="Adresa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <textarea
        placeholder="Popis (co nabízíte, otevírací doba...)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
      />
      <button
        onClick={handleSubmit}
        style={btnStyle}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mb-10"
      >
        Uložit profil
      </button>

      <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-6 tracking-widest uppercase">
        Moje služby
      </h2>

      <input
        type="text"
        placeholder="Název služby (např. Pedikúra)"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Cena (Kč)"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          style={inputStyle}
          className="w-full border px-4 py-3 focus:outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Délka (min)"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          style={inputStyle}
          className="w-full border px-4 py-3 focus:outline-none text-sm"
        />
      </div>
      <button
        onClick={handleAddService}
        style={btnStyle}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mb-6"
      >
        Přidat službu
      </button>

      <ul>
        {services.map(s => (
          <li key={s.id}
            style={{
              borderLeftColor: 'var(--accent)',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}
            className="flex justify-between items-center border border-l-2 px-4 py-3 mb-2"
          >
            <div>
              <div style={{ color: 'var(--text-primary)' }} className="font-medium text-sm">{s.name}</div>
              <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                {s.price && `${s.price} Kč`} {s.duration && `· ${s.duration} min`}
              </div>
            </div>
            <button
              onClick={() => handleDeleteService(s.id)}
              style={{ color: 'var(--text-muted)' }}
              className="hover:text-red-400 text-xs transition ml-4"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>

        <div className="mt-10">
      <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-6 tracking-widest uppercase">
        Vzhled
      </h2>

      {/* Dark / Light přepínač */}
        <div style={{ borderColor: 'var(--border)' }} className="flex border rounded-lg overflow-hidden mb-6">
          {['dark', 'light'].map(m => (
            <button
            key={m}
            onClick={() => onModeChange(m)}
            style={{
          backgroundColor: mode === m ? 'var(--accent)' : 'transparent',
          color: mode === m ? '#000' : 'var(--text-muted)',
              }}
            className="flex-1 py-2 text-xs tracking-widest uppercase transition font-medium">
              
            {m === 'dark' ? 'Tmavý' : 'Světlý'}
            </button>
              ))}
          </div>

  {/* Barevná schémata */}
  <div className="grid grid-cols-2 gap-3">
    {[
      { id: 'green', label: 'Default', color: '#86efac' },
      { id: 'blue', label: 'Blue', color: '#60a5fa' },
      { id: 'pink', label: 'Pink', color: '#f9a8d4' },
      { id: 'cyberpunk', label: 'Cyberpunk', color: '#fde047' },
    ].map(t => (
      <button
        key={t.id}
        onClick={() => onThemeChange(t.id)}
        style={{
          borderColor: theme === t.id ? t.color : 'var(--border)',
          color: theme === t.id ? t.color : 'var(--text-muted)',
          backgroundColor: theme === t.id ? `${t.color}15` : 'transparent',
          borderRadius: 'var(--radius-sm)',
        }}
        className="border py-3 px-4 text-sm tracking-wide transition text-left">
                <div className="flex items-center gap-3">
              <div style={{ backgroundColor: t.color }} className="w-3 h-3 rounded-full" />
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