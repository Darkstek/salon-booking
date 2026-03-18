import { useState, useEffect } from 'react';
import './AddCustomer.css';
import toast from 'react-hot-toast';

function AddCustomer() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [customers, setCustomers] = useState([]);

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
  const newList = [...customers, newCustomer];
  setCustomers(newList);
  setName('');
  setPhone('');
  setNote('');
  toast.success('Zákazník uložen! ✅');
};

 return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Přidat zákazníka</h2>

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
        className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg w-full transition"
      >
        Uložit zákazníka
      </button>

      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">Zákazníci:</h3>
      <ul>
        {customers.map(customer => (
        <li key={customer.id} className="bg-pink-50 border-l-4 border-pink-300 rounded-lg px-4 py-3 mb-2">
        <div className="font-medium text-gray-800">{customer.name} — {customer.phone}</div>
          {customer.note && (
        <div className="text-gray-500 text-sm mt-1">📝 {customer.note}</div>
          )}
    </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCustomer;