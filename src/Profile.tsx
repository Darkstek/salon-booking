import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_URL, { fetchWithAuth } from "./config";

type Theme = "green" | "blue" | "pink" | "cyberpunk";
type Mode = "dark" | "light";

interface ProfileProps {
  theme: Theme;
  mode: Mode;
  onThemeChange: (theme: Theme) => void;
  onModeChange: (mode: Mode) => void;
}

interface Service {
  id: number;
  name: string;
  price?: number;
  duration?: number;
  user_id?: number;
}

interface AvailabilityDay {
  day_of_week: number;
  start_time: string;
  end_time: string;
  active: boolean;
}

interface ProfileData {
  business_name?: string;
  phone?: string;
  address?: string;
  description?: string;
  slot_duration?: number;
  user_id?: number;
}

function Profile({ onThemeChange, theme, onModeChange, mode }: ProfileProps) {
  const [businessName, setBusinessName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceName, setServiceName] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("");
  const [serviceDuration, setServiceDuration] = useState<string>("");
  const [slotDuration, setSlotDuration] = useState<number>(60);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([
    { day_of_week: 1, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 2, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 3, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 4, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 5, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 6, start_time: "08:00", end_time: "16:00", active: false },
    { day_of_week: 0, start_time: "08:00", end_time: "16:00", active: false },
  ]);

  useEffect(() => {
    fetchWithAuth(`${API_URL}/api/profile`)
      .then((res) => res.json())
      .then((data: ProfileData) => {
        if (data) {
          setBusinessName(data.business_name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setDescription(data.description || "");
          if (data.slot_duration) setSlotDuration(data.slot_duration);
        }
        setLoading(false);
      });

    fetchWithAuth(`${API_URL}/api/availability`)
      .then((res) => res.json())
      .then((data: AvailabilityDay[]) => {
        if (data.length > 0) {
          setAvailability((prev) =>
            prev.map((day) => {
              const found = data.find((d) => d.day_of_week === day.day_of_week);
              if (found) {
                return {
                  ...day,
                  start_time: found.start_time.slice(0, 5),
                  end_time: found.end_time.slice(0, 5),
                  active: true,
                };
              }
              return { ...day, active: false };
            }),
          );
        }
      });

    fetchWithAuth(`${API_URL}/api/profile`)
      .then((res) => res.json())
      .then((profile: ProfileData) => {
        if (profile?.user_id) {
          fetch(`${API_URL}/api/services/${profile.user_id}`)
            .then((res) => res.json())
            .then((data) => setServices(data));
        }
      });
  }, []);

  const handleSubmit = async (): Promise<void> => {
    const response = await fetchWithAuth(`${API_URL}/api/profile`, {
      method: "POST",
      body: JSON.stringify({
        business_name: businessName,
        phone,
        address,
        description,
      }),
    });
    if (response.ok) {
      toast.success("Profil uložen!");
    } else {
      toast.error("Něco se pokazilo");
    }
  };

  const handleSaveAvailability = async (): Promise<void> => {
    const activeDays = availability.filter((d) => d.active);
    await fetchWithAuth(`${API_URL}/api/availability`, {
      method: "POST",
      body: JSON.stringify({
        availability: activeDays,
        slot_duration: slotDuration,
      }),
    });
    toast.success("Dostupnost uložena!");
  };

  const handleAddService = async (): Promise<void> => {
    if (!serviceName) return;
    const response = await fetchWithAuth(`${API_URL}/api/services`, {
      method: "POST",
      body: JSON.stringify({
        name: serviceName,
        price: servicePrice ? parseInt(servicePrice) : null,
        duration: serviceDuration ? parseInt(serviceDuration) : null,
      }),
    });
    const newService = await response.json();
    setServices([...services, newService]);
    setServiceName("");
    setServicePrice("");
    setServiceDuration("");
    toast.success("Služba přidána!");
  };

  const handleDeleteService = async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_URL}/api/services/${id}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== id));
    toast.success("Služba smazána!");
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-card)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-sm)",
  };

  const btnStyle: React.CSSProperties = {
    backgroundColor: "var(--accent)",
    borderRadius: "var(--radius-sm)",
    clipPath: "var(--btn-clip)",
  };

  if (loading)
    return (
      <div
        style={{ color: "var(--text-muted)" }}
        className="text-center mt-10 tracking-wide text-sm"
      >
        Načítám...
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius)",
      }}
      className="max-w-xl mx-auto mt-6 border p-8 mb-6"
    >
      {/* SEKCE 1 — Profil */}
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-medium mb-6 tracking-widest uppercase"
      >
        Můj profil
      </h2>
      <input
        type="text"
        placeholder="Název podniku"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
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
      <input
        type="text"
        placeholder="Adresa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <textarea
        placeholder="Popis (co nabízíte, otevírací doba...)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-6 focus:outline-none text-sm"
      />
      <button
        onClick={handleSubmit}
        style={btnStyle}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mb-10"
      >
        Uložit profil
      </button>

      {/* SEKCE 2 — Dostupnost */}
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-medium mb-6 tracking-widest uppercase"
      >
        Dostupnost
      </h2>
      <div className="mb-6">
        <label
          style={{ color: "var(--text-muted)" }}
          className="text-xs tracking-widest uppercase block mb-2"
        >
          Délka slotu (minuty)
        </label>
        <select
          value={slotDuration}
          onChange={(e) => setSlotDuration(parseInt(e.target.value))}
          style={inputStyle}
          className="w-full border px-4 py-3 focus:outline-none text-sm"
        >
          <option value={15}>15 minut</option>
          <option value={30}>30 minut</option>
          <option value={45}>45 minut</option>
          <option value={60}>60 minut</option>
          <option value={90}>90 minut</option>
          <option value={120}>120 minut</option>
        </select>
      </div>

      {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((dayName, index) => {
        const dayNumber = index === 6 ? 0 : index + 1;
        const day = availability.find((d) => d.day_of_week === dayNumber);
        if (!day) return null;
        return (
          <div
            key={index}
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-sm)",
            }}
            className="border px-4 py-3 mb-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                style={{
                  color: day.active
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                }}
                className="text-sm font-medium w-8"
              >
                {dayName}
              </span>
              <button
                onClick={() =>
                  setAvailability((prev) =>
                    prev.map((d) =>
                      d.day_of_week === dayNumber
                        ? { ...d, active: !d.active }
                        : d,
                    ),
                  )
                }
                style={{
                  backgroundColor: day.active
                    ? "var(--accent)"
                    : "var(--border)",
                  borderRadius: "9999px",
                }}
                className="w-10 h-5 transition-all relative"
              >
                <span
                  style={{
                    backgroundColor: "white",
                    borderRadius: "9999px",
                    position: "absolute",
                    top: "2px",
                    left: day.active ? "22px" : "2px",
                    transition: "left 0.2s",
                    width: "16px",
                    height: "16px",
                    display: "block",
                  }}
                />
              </button>
            </div>
            {day.active && (
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <label
                    style={{ color: "var(--text-muted)" }}
                    className="text-xs block mb-1"
                  >
                    Od
                  </label>
                  <input
                    type="time"
                    value={day.start_time}
                    onChange={(e) =>
                      setAvailability((prev) =>
                        prev.map((d) =>
                          d.day_of_week === dayNumber
                            ? { ...d, start_time: e.target.value }
                            : d,
                        ),
                      )
                    }
                    style={inputStyle}
                    className="w-full border px-3 py-2 focus:outline-none text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label
                    style={{ color: "var(--text-muted)" }}
                    className="text-xs block mb-1"
                  >
                    Do
                  </label>
                  <input
                    type="time"
                    value={day.end_time}
                    onChange={(e) =>
                      setAvailability((prev) =>
                        prev.map((d) =>
                          d.day_of_week === dayNumber
                            ? { ...d, end_time: e.target.value }
                            : d,
                        ),
                      )
                    }
                    style={inputStyle}
                    className="w-full border px-3 py-2 focus:outline-none text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={handleSaveAvailability}
        style={btnStyle}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mt-4 mb-10"
      >
        Uložit dostupnost
      </button>

      {/* SEKCE 3 — Moje služby */}
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-medium mb-6 tracking-widest uppercase"
      >
        Moje služby
      </h2>
      <input
        type="text"
        placeholder="Název služby (např. Pedikúra)"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        style={inputStyle}
        className="w-full border px-4 py-3 mb-4 focus:outline-none text-sm"
      />
      <div className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Cena (Kč)"
          value={servicePrice}
          onChange={(e) => setServicePrice(e.target.value)}
          style={inputStyle}
          className="w-full border px-4 py-3 focus:outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Délka (min)"
          value={serviceDuration}
          onChange={(e) => setServiceDuration(e.target.value)}
          style={inputStyle}
          className="w-full border px-4 py-3 focus:outline-none text-sm"
        />
      </div>
      <button
        onClick={handleAddService}
        style={btnStyle}
        className="text-gray-900 font-medium py-3 px-6 w-full transition tracking-wide text-sm hover:opacity-90 mb-6"
      >
        Přidat službu
      </button>
      <ul>
        {services.map((s) => (
          <li
            key={s.id}
            style={{
              borderLeftColor: "var(--accent)",
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius-sm)",
            }}
            className="flex justify-between items-center border border-l-2 px-4 py-3 mb-2"
          >
            <div>
              <div
                style={{ color: "var(--text-primary)" }}
                className="font-medium text-sm"
              >
                {s.name}
              </div>
              <div style={{ color: "var(--text-muted)" }} className="text-xs">
                {s.price && `${s.price} Kč`}{" "}
                {s.duration && `· ${s.duration} min`}
              </div>
            </div>
            <button
              onClick={() => handleDeleteService(s.id)}
              style={{ color: "var(--text-muted)" }}
              className="hover:text-red-400 text-xs transition ml-4"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>

      {/* SEKCE 4 — Vzhled */}
      <div className="mt-10">
        <h2
          style={{ color: "var(--text-primary)" }}
          className="text-xl font-medium mb-6 tracking-widest uppercase"
        >
          Vzhled
        </h2>
        <div
          style={{ borderColor: "var(--border)" }}
          className="flex border rounded-lg overflow-hidden mb-6"
        >
          {(["dark", "light"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              style={{
                backgroundColor: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "#000" : "var(--text-muted)",
              }}
              className="flex-1 py-2 text-xs tracking-widest uppercase transition font-medium"
            >
              {m === "dark" ? "Tmavý" : "Světlý"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "green" as Theme, label: "Default", color: "#86efac" },
            { id: "blue" as Theme, label: "Blue", color: "#60a5fa" },
            { id: "pink" as Theme, label: "Pink", color: "#f9a8d4" },
            { id: "cyberpunk" as Theme, label: "Cyberpunk", color: "#fde047" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              style={{
                borderColor: theme === t.id ? t.color : "var(--border)",
                color: theme === t.id ? t.color : "var(--text-muted)",
                backgroundColor:
                  theme === t.id ? `${t.color}15` : "transparent",
                borderRadius: "var(--radius-sm)",
              }}
              className="border py-3 px-4 text-sm tracking-wide transition text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: t.color }}
                  className="w-3 h-3 rounded-full"
                />
                {t.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
