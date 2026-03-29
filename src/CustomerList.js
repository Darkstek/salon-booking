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
    toast.success('Zákazník uložen!');
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

  const inputStyle = {
    backgroundColor: 'var(--bg-card)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)',
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
        Zákazníci
      </h2>

      <input
        type="text"
        placeholder="Hledat zákazníka..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
      />
      <input
        type="text"
        placeholder="Jméno zákazníka"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <textarea
        placeholder="Poznámka"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: 'var(--accent)',
          borderRadius: 'var(--radius-sm)',
          clipPath: 'var(--btn-clip)',
        }}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mb-8"
      >
        Přidat zákazníka
      </button>

      <ul>
        {customers
          .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
          .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'cs'))
          .map(c => (
            <li key={c.id}
              style={{
                borderLeftColor: 'var(--accent)',
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius-sm)',
              }}
              className="border border-l-2 px-4 py-3 mb-2"
            >
              <div className="flex justify-between items-center">
                <div className="cursor-pointer flex-1" onClick={() => handleSelectCustomer(c)}>
                  <div style={{ color: 'var(--text-primary)' }} className="font-medium text-sm">
                    {c.name}{c.phone ? ` — ${c.phone}` : ''}
                  </div>
                  {c.note && (
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">{c.note}</div>
                  )}
                </div>
                <button
                  onClick={() => setDeleteId(c.id)}
                  style={{ color: 'var(--text-muted)' }}
                  className="hover:text-red-400 text-xs transition ml-4"
                >
                  Smazat
                </button>
              </div>

              {selectedCustomer?.id === c.id && customerDetail && (
                <div style={{ borderTopColor: 'var(--border)' }} className="mt-3 pt-3 border-t">
                  {customerDetail.upcoming.length > 0 && (
                    <div
                      style={{
                        borderLeftColor: 'var(--accent)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      className="border border-l-2 px-3 py-2 mb-3"
                    >
                      <div style={{ color: 'var(--accent)' }} className="font-medium text-xs mb-1 tracking-wide uppercase">
                        Nadcházející schůzky
                      </div>
                      {customerDetail.upcoming.map(u => (
                        <div key={u.id} style={{ color: 'var(--text-secondary)' }} className="text-xs">
                          {u.service_name} — {new Date(u.appointment_date).toLocaleDateString('cs-CZ')} v {u.appointment_time.slice(0, 5)}
                        </div>
                      ))}
                    </div>
                  )}

                  {customerDetail.history.length > 0 && (
                    <div>
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs uppercase tracking-widest mb-2">
                        Historie návštěv
                      </div>
                      {customerDetail.history.map(h => (
                        <div key={h.id} style={{ color: 'var(--text-muted)' }} className="text-xs mb-1">
                          {new Date(h.appointment_date).toLocaleDateString('cs-CZ')} — {h.service_name}
                        </div>
                      ))}
                    </div>
                  )}

                  {!customerDetail.upcoming && customerDetail.history.length === 0 && (
                    <div style={{ color: 'var(--text-muted)' }} className="text-sm">Žádná historie</div>
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border p-8 max-w-sm w-full mx-4"
          >
            <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-medium mb-2 tracking-wide">
              Smazat zákazníka?
            </h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-6">Tato akce je nevratná.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 flex-1 transition"
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                Smazat
              </button>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-sm)',
                }}
                className="font-medium py-2 px-6 flex-1 transition hover:opacity-80"
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