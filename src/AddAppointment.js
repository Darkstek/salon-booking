import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function AddAppointment() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [services, setServices] = useState([]);
  const [customService, setCustomService] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data));

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
    toast.success('Termín uložen!');
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
  };

  const labelStyle = {
    color: 'var(--text-muted)',
  };

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
        Přidat termín
      </h2>

      <input
  type="text"
  placeholder="Hledat zákazníka..."
  value={customerSearch}
  onChange={(e) => {
    setCustomerSearch(e.target.value);
    setCustomerId('');
  }}
  style={inputStyle}
  className="w-full border px-4 py-3 mb-2 focus:outline-none text-sm"
/>
{customerSearch && (
  <div
    style={{
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border)',
      borderRadius: 'var(--radius-sm)',
    }}
    className="border mb-4 max-h-48 overflow-y-auto"
  >
    {customers
      .filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'cs'))
      .map(c => (
        <div
          key={c.id}
          onClick={() => {
            setCustomerId(c.id);
            setCustomerSearch(c.name);
          }}
          style={{
            color: customerId === String(c.id) ? 'var(--accent)' : 'var(--text-primary)',
            borderBottomColor: 'var(--border)',
          }}
          className="px-4 py-2 text-sm cursor-pointer hover:opacity-70 transition border-b last:border-0"
        >
          {c.name}
        </div>
      ))}
  </div>
)}
{!customerSearch && (
  <select
    value={customerId}
    onChange={(e) => setCustomerId(e.target.value)}
    style={inputStyle}
    className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
  >
    <option value="">Vyber zákazníka</option>
    {customers
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'cs'))
      .map(c => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
  </select>
)}

      {!useCustom ? (
        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          style={inputStyle}
          className="w-full border px-4 py-3 mb-2 focus:outline-none text-sm"
        >
          <option value="">Vyber službu</option>
          {services.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="Napiš název služby"
          value={customService}
          onChange={(e) => {
            setCustomService(e.target.value);
            setServiceName(e.target.value);
          }}
          style={inputStyle}
          className="w-full border px-4 py-3 mb-2 focus:outline-none text-sm"
        />
      )}

      <button
        onClick={() => {
          setUseCustom(!useCustom);
          setServiceName('');
          setCustomService('');
        }}
        style={{ color: 'var(--accent)' }}
        className="text-xs mb-4 tracking-wide transition hover:opacity-80"
      >
        {useCustom ? '← Vybrat ze seznamu' : '+ Zadat vlastní službu'}
      </button>

    <label style={labelStyle} className="text-xs tracking-widest uppercase block mb-1">
  Datum
</label>
          <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
          />

      <label style={labelStyle} className="text-xs tracking-widest uppercase block mb-1">
        Čas
      </label>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />

      <textarea
        placeholder="Poznámka"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
      />

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: 'var(--accent)',
          borderRadius: 'var(--radius-sm)',
          clipPath: 'var(--btn-clip)',
        }}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90"
      >
        Uložit termín
      </button>
    </div>
  );
}

export default AddAppointment;