import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/customers')
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const handleSubmit = async () => {
    if (name === '') return;

    const response = await fetch('http://localhost:5000/api/customers', {
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

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/customers/${id}`, {
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
        {customers.map(c => (
          <li key={c.id} className="bg-pink-50 border-l-4 border-pink-300 rounded-lg px-4 py-3 mb-2">
            <div className="flex justify-between items-center">
              <div>
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