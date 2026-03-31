import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from './config';

function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot('');
    if (!date || !profile?.user_id) return;
    const res = await fetch(`${API_URL}/api/slots/${profile.user_id}/${date}`);
    const data = await res.json();
    setSlots(data.slots || []);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedService || !customerName || !selectedDate) return;
    setBookingLoading(true);
    await fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: profile.user_id,
        service_name: selectedService,
        appointment_date: selectedDate,
        appointment_time: selectedSlot,
        customer_name: customerName,
        customer_phone: customerPhone,
      }),
    });
    setBookingLoading(false);
    setBookingSuccess(true);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/profiles/public`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id === parseInt(id));
        setProfile(found);
        setLoading(false);
        if (found?.user_id) {
          fetch(`${API_URL}/api/services/${found.user_id}`)
            .then(res => res.json())
            .then(data => setServices(data));
        }
      });
  }, [id]);

  if (loading) return (
    <div style={{ color: 'var(--text-muted)' }} className="text-center mt-10 text-sm tracking-wide">
      Načítám...
    </div>
  );
  if (!profile) return (
    <div style={{ color: 'var(--text-muted)' }} className="text-center mt-10 text-sm tracking-wide">
      Salon nenalezen
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen">
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
        }}
        className="py-6 text-center"
      >
        <h1 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium tracking-widest uppercase">
          Salon Booking
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-4 mt-8 mb-10">

        <div
          style={{
            borderLeftColor: 'var(--accent)',
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius)',
          }}
          className="border border-l-2 px-6 py-6 mb-4"
        >
          <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-medium mb-4 tracking-wide">
            {profile.business_name}
          </h2>
          {profile.phone && (
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-2">
              Tel: {profile.phone}
            </p>
          )}
          {profile.address && (
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-2">
              Adresa: {profile.address}
            </p>
          )}
          {profile.description && (
            <p style={{ color: 'var(--text-muted)', borderTopColor: 'var(--border)' }} className="text-sm mt-4 border-t pt-4">
              {profile.description}
            </p>
          )}
        </div>

        {services.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border px-6 py-6 mb-6"
          >
            <h3 style={{ color: 'var(--text-muted)' }} className="text-xs font-medium mb-4 tracking-widest uppercase">
              Nabízené služby
            </h3>
            {services.map(s => (
              <div
                key={s.id}
                style={{ borderBottomColor: 'var(--border)' }}
                className="flex justify-between items-center border-b py-3 last:border-0"
              >
                <span style={{ color: 'var(--text-primary)' }} className="text-sm">{s.name}</span>
                <div className="text-right">
                  {s.price && (
                    <span style={{ color: 'var(--accent)' }} className="text-sm font-medium">
                      {s.price} Kč
                    </span>
                  )}
                  {s.duration && (
                    <span style={{ color: 'var(--text-muted)' }} className="text-xs ml-3">
                      {s.duration} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {bookingSuccess ? (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--accent)',
              borderRadius: 'var(--radius)',
            }}
            className="border px-6 py-8 mb-6 text-center"
          >
            <div style={{ color: 'var(--accent)' }} className="text-2xl mb-3">✓</div>
            <h3 style={{ color: 'var(--text-primary)' }} className="text-lg font-medium mb-2">Rezervace potvrzena!</h3>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">
              {selectedDate} v {selectedSlot} — {selectedService}
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="border px-6 py-6 mb-6"
          >
            <h3 style={{ color: 'var(--text-muted)' }} className="text-xs font-medium mb-4 tracking-widest uppercase">
              Rezervovat termín
            </h3>

            <label style={{ color: 'var(--text-muted)' }} className="text-xs tracking-widest uppercase block mb-1">Datum</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
              }}
              className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
            />

            {selectedDate && slots.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-4">
                V tento den nejsou volné termíny.
              </p>
            )}

            {slots.length > 0 && (
              <>
                <label style={{ color: 'var(--text-muted)' }} className="text-xs tracking-widest uppercase block mb-2">Čas</label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        backgroundColor: selectedSlot === slot ? 'var(--accent)' : 'var(--bg-card)',
                        color: selectedSlot === slot ? '#000' : 'var(--text-primary)',
                        borderColor: 'var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      className="border py-2 text-sm transition hover:opacity-80"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedSlot && (
              <>
                <label style={{ color: 'var(--text-muted)' }} className="text-xs tracking-widest uppercase block mb-2">Služba</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
                >
                  <option value="">Vyber službu</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>

                <label style={{ color: 'var(--text-muted)' }} className="text-xs tracking-widest uppercase block mb-1">Vaše jméno</label>
                <input
                  type="text"
                  placeholder="Jana Nováková"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
                />

                <label style={{ color: 'var(--text-muted)' }} className="text-xs tracking-widest uppercase block mb-1">Telefon (nepovinné)</label>
                <input
                  type="text"
                  placeholder="777 123 456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
                />

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  style={{
                    backgroundColor: 'var(--accent)',
                    borderRadius: 'var(--radius-sm)',
                    clipPath: 'var(--btn-clip)',
                  }}
                  className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90"
                >
                  {bookingLoading ? 'Ukládám...' : 'Rezervovat'}
                </button>
              </>
            )}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          style={{ color: 'var(--text-muted)' }}
          className="hover:opacity-80 text-xs transition w-full text-center tracking-wide"
        >
          Zpět na seznam salonů
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;