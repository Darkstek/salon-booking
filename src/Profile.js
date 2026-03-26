import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function Profile() {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

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
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition"
      >
        Uložit profil
      </button>
    </div>
  );
}

export default Profile;