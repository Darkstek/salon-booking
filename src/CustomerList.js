import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);


  
  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const handleSubmit = async () => {
    if (name === '') return;

    const response = await fetchWithAuth(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, note }),
    });

    const newCustomer = await response.json();
    setCustomers([...customers, newCustomer]);
    setName('');
    setPhone('');
    setNote('');
    toast.success('Zákazník uložen! ✅');
  };

  const handleSelectCustomer = async (customer) => {
  if (selectedCustomer?.id === customer.id) {
    setSelectedCustomer(null);
    setCustomerDetail(null);
    return;
    }
  
    setSelectedCustomer(customer);
  
    const response = await fetchWithAuth(`${API_URL}/api/customers/${customer.id}/detail`);
    const data = await response.json();
    setCustomerDetail(data);
    };

  const handleDelete = async (id) => {
    await fetchWithAuth(`${API_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    setCustomers(customers.filter(c => c.id !== id));
    setDeleteId(null);
    toast.success('Zákazník smazán!');
    };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👥 Zákazníci</h2>

      <input
        type="text"
        placeholder="🔍 Hledat zákazníka..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-pink-400"
      />

      <input
        type="text"
        placeholder="Jméno zákazníka"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <input
        type="text"
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <textarea
        placeholder="Poznámka"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-pink-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-pink-400"
      />
      <button
        onClick={handleSubmit}
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition mb-8"
      >
        Přidat zákazníka
      </button>

      <ul>
        {customers.filter(c =>
  c.name.toLowerCase().includes(search.toLowerCase())
).map(c => (
         <li key={c.id} className="bg-pink-50 border-l-4 border-pink-300 rounded-lg px-4 py-3 mb-2">
  <div className="flex justify-between items-center">
    <div 
      className="cursor-pointer flex-1"
      onClick={() => handleSelectCustomer(c)}
    >
      <div className="font-medium text-gray-800">{c.name} — {c.phone}</div>
      {c.note && <div className="text-gray-500 text-sm mt-1">📝 {c.note}</div>}
    </div>
    <button
      onClick={() => setDeleteId(c.id)}
      className="text-red-300 hover:text-red-500 text-xs transition ml-4"
    >
      🗑
    </button>
  </div>

  {selectedCustomer?.id === c.id && customerDetail && (
    <div className="mt-3 pt-3 border-t border-pink-200">
      
      {customerDetail.upcoming.length > 0 && (
  <div className="bg-green-50 border-l-4 border-green-400 rounded-lg px-3 py-2 mb-3">
    <div className="text-green-700 font-medium text-sm mb-1">✅ Nadcházející schůzky</div>
    {customerDetail.upcoming.map(u => (
      <div key={u.id} className="text-green-600 text-sm">
        {u.service_name} — {new Date(u.appointment_date).toLocaleDateString('cs-CZ')} v {u.appointment_time.slice(0, 5)}
      </div>
    ))}
  </div>
)}

      {customerDetail.history.length > 0 && (
        <div>
          <div className="text-gray-500 text-xs font-bold uppercase mb-2">Historie návštěv</div>
          {customerDetail.history.map(h => (
            <div key={h.id} className="text-gray-500 text-sm mb-1">
              {new Date(h.appointment_date).toLocaleDateString('cs-CZ')} — {h.service_name}
            </div>
          ))}
        </div>
      )}

      {!customerDetail.upcoming && customerDetail.history.length === 0 && (
        <div className="text-gray-400 text-sm">Žádná historie</div>
      )}
    </div>
  )}
</li>
        ))}
      </ul>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Smazat zákazníka?</h3>
            <p className="text-gray-400 mb-6">Tato akce je nevratná.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg flex-1 transition"
              >
                Smazat
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2 px-6 rounded-lg flex-1 transition"
              >
                Zrušit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;