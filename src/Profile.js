import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function Profile() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // 👇 NOVÉ: stav pro služby
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  // 👆 konec nového stavu

  useEffect(() => {
    // Načtení profilu
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

    // 👇 NOVÉ: načtení služeb
    fetchWithAuth(`${API_URL}/api/profile`)
      .then(res => res.json())
      .then(profile => {
        if (profile?.user_id) {
          fetch(`${API_URL}/api/services/${profile.user_id}`)
            .then(res => res.json())
            .then(data => setServices(data));
        }
      });
    // 👆 konec nového načtení
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

  // 👇 NOVÉ: přidání služby
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

  // 👇 NOVÉ: smazání služby
  const handleDeleteService = async (id) => {
    await fetchWithAuth(`${API_URL}/api/services/${id}`, {
      method: 'DELETE',
    });
    setServices(services.filter(s => s.id !== id));
    toast.success('Služba smazána!');
  };
  // 👆 konec nových funkcí

  if (loading) return <div className="text-center mt-10 text-gray-400">Načítám...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Můj profil</h2>

      <input
        type="text"
        placeholder="Název podniku"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <input
        type="text"
        placeholder="Adresa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <textarea
        placeholder="Popis (co nabízíte, otevírací doba...)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-pink-400"
      />
      <button
        onClick={handleSubmit}
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition mb-10"
      >
        Uložit profil
      </button>
        
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Moje služby</h2>

      <input
        type="text"
        placeholder="Název služby (např. Pedikúra)"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Cena (Kč)"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          className="w-full border border-pink-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400"
        />
        <input
          type="number"
          placeholder="Délka (min)"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          className="w-full border border-pink-200 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-400"
        />
      </div>
      <button
        onClick={handleAddService}
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition mb-6"
      >
        Přidat službu
      </button>

      <ul>
        {services.map(s => (
          <li key={s.id} className="flex justify-between items-center bg-pink-50 border-l-4 border-pink-300 rounded-lg px-4 py-3 mb-2">
            <div>
              <div className="font-medium text-gray-800">{s.name}</div>
              <div className="text-gray-500 text-sm">
                {s.price && `${s.price} Kč`} {s.duration && `· ${s.duration} min`}
              </div>
            </div>
            <button
              onClick={() => handleDeleteService(s.id)}
              className="text-red-300 hover:text-red-500 text-xs transition ml-4"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
      {/* 👆 konec sekce pro služby */}
    </div>
  );
}

export default Profile;