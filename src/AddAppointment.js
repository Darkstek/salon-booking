import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

const services = [
  { id: 1, name: 'Pedikúra' },
  { id: 2, name: 'Manikúra' },
  { id: 3, name: 'Úprava nehtů' },
  { id: 4, name: 'Ošetření zarostlého nehtu' },
  { id: 5, name: 'Gellak' },
  { id: 6, name: 'Pedikúra a gellak' },
  { id: 7, name: 'Aplikace titanové nitě' },
  { id: 8, name: 'Aplikace nehtové špony' },
];

function AddAppointment() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const handleSubmit = async () => {
    if (!customerId || !serviceName || !date || !time) return;

    await fetchWithAuth(`${API_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customerId,
        service_name: serviceName,
        appointment_date: date,
        appointment_time: time,
        note,
      }),
    });

    setCustomerId('');
    setServiceName('');
    setDate('');
    setTime('');
    setNote('');
    toast.success('Termín uložen! ✅');
  };

 return (
    <div className="max-w-xl mx-auto mt-6 bg-[#1a1d27] border border-white/5 rounded-2xl p-8 mb-6">
      <h2 className="text-xl font-medium text-white mb-6 tracking-widest uppercase">Přidat termín</h2>

      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      >
        <option value="">Vyber zákazníka</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      >
        <option value="">Vyber službu</option>
        {services.map(s => (
          <option key={s.id} value={s.name}>{s.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />

      <textarea
        placeholder="Poznámka"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-white/10 bg-[#0f1117] text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-500/50 text-sm"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg w-full transition tracking-wide text-sm"
      >
        Uložit termín
      </button>
    </div>
  );
}

export default AddAppointment;