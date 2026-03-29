import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_URL, { fetchWithAuth } from './config';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  const handleDelete = async (id) => {
    await fetchWithAuth(`${API_URL}/api/appointments/${id}`, {
      method: 'DELETE',
    });
    setAppointments(appointments.filter(a => a.id !== id));
    setDeleteId(null);
    toast.success('Termín smazán!');
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7days = new Date(today);
  next7days.setDate(today.getDate() + 7);

  const upcoming = appointments.filter(a => {
    const d = new Date(a.appointment_date);
    return d >= today && d <= next7days;
  });

  const future = appointments.filter(a => new Date(a.appointment_date) > next7days);
  const past = appointments.filter(a => new Date(a.appointment_date) < today);

  const groupByDate = (list) => {
    return list.reduce((groups, a) => {
      const date = new Date(a.appointment_date).toLocaleDateString('cs-CZ');
      if (!groups[date]) groups[date] = [];
      groups[date].push(a);
      return groups;
    }, {});
  };

  const renderGroup = (groups) => {
    return Object.entries(groups).map(([date, items]) => (
      <div key={date} className="mb-6">
        <div style={{ color: 'var(--accent)' }} className="text-xs font-medium uppercase tracking-widest mb-3">
          {date}
        </div>
        {items.map(a => (
          <div key={a.id}
            style={{
              borderLeftColor: 'var(--accent)',
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius-sm)',
              clipPath: 'var(--btn-clip)',
            }}
            className="border border-l-2 px-4 py-4 mb-2"
          >
            <div className="flex justify-between items-center">
              <strong style={{ color: 'var(--text-primary)' }} className="font-medium">{a.customer_name}</strong>
              <span style={{ color: 'var(--accent)' }} className="text-sm">{a.service_name}</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-2">
              {a.appointment_time.slice(0, 5)}
            </div>
            {a.note && (
              <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">{a.note}</div>
            )}
            <button
              onClick={() => setDeleteId(a.id)}
              style={{ color: 'var(--text-muted)' }}
              className="hover:text-red-400 text-xs mt-2 transition"
            >
              Smazat
            </button>
          </div>
        ))}
      </div>
    ));
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
      <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-6 tracking-widest uppercase">Termíny</h2>

      <h3 style={{ color: 'var(--text-muted)' }} className="text-xs font-medium mb-4 tracking-widest uppercase">Tento týden</h3>
      {upcoming.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }} className="mb-4 text-sm">Žádné termíny tento týden</p>
      ) : (
        renderGroup(groupByDate(upcoming))
      )}

      {future.length > 0 && (
        <>
          <h3 style={{ color: 'var(--text-muted)' }} className="text-xs font-medium mt-6 mb-4 tracking-widest uppercase">Budoucí termíny</h3>
          <div>{renderGroup(groupByDate(future))}</div>
        </>
      )}

      <button
        onClick={() => setShowPast(!showPast)}
        style={{ color: 'var(--text-muted)' }}
        className="hover:opacity-80 text-xs mt-4 tracking-wide transition"
      >
        {showPast ? '▲ Skrýt historii' : '▼ Zobrazit historii'}
      </button>

      {showPast && past.length > 0 && (
        <div className="mt-4 opacity-60">
          {renderGroup(groupByDate(past))}
        </div>
      )}

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
            <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-medium mb-2 tracking-wide">Smazat termín?</h3>
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

export default AppointmentList;