import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/appointments/${id}`, {
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
        <div className="text-sm font-bold text-pink-400 uppercase tracking-wide mb-2">
          📆 {date}
        </div>
        {items.map(a => (
          <div key={a.id} className="bg-pink-50 border-l-4 border-pink-300 rounded-lg px-5 py-4 mb-2">
            <div className="flex justify-between items-center">
              <strong className="text-gray-800">{a.customer_name}</strong>
              <span className="text-pink-400 font-medium">{a.service_name}</span>
            </div>
            <div className="text-gray-500 text-sm mt-1">
              ⏰ {a.appointment_time.slice(0, 5)}
            </div>
            {a.note && (
              <div className="text-gray-500 text-sm mt-1">📝 {a.note}</div>
            )}
            <button
              onClick={() => setDeleteId(a.id)}
              className="text-red-300 hover:text-red-500 text-xs mt-2 transition"
            >
              🗑 Smazat
            </button>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Termíny</h2>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">Tento týden</h3>
      {upcoming.length === 0 ? (
        <p className="text-gray-400 mb-4">Žádné termíny tento týden</p>
      ) : (
        renderGroup(groupByDate(upcoming))
      )}

      {future.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4">Budoucí termíny</h3>
          <div>{renderGroup(groupByDate(future))}</div>
        </>
      )}

      <button
        onClick={() => setShowPast(!showPast)}
        className="text-gray-400 hover:text-gray-600 text-sm mt-4"
      >
        {showPast ? '▲ Skrýt historii' : '▼ Zobrazit historii'}
      </button>

      {showPast && past.length > 0 && (
        <div className="mt-4 opacity-60">
          {renderGroup(groupByDate(past))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Smazat termín?</h3>
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

export default AppointmentList;