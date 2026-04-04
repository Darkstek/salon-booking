import { useState, useEffect } from "react";
// useState = pamatuje si hodnoty uvnitř komponenty
// useEffect = spustí kód po načtení komponenty (fetch dat z API)

import toast from "react-hot-toast";
// toast notifikace — toast.success(), toast.error()

import API_URL, { fetchWithAuth } from "./config";
// API_URL = URL backendu
// fetchWithAuth = fetch který automaticky přidá JWT token do hlavičky

// Interface — šablona pro jeden termín z databáze
// Každý sloupec z tabulky appointments má svůj typ
interface Appointment {
  id: number;                    // SERIAL PRIMARY KEY → number
  customer_name: string;         // přichází z JOIN nebo customer_name_unregistered
  service_name: string;          // VARCHAR NOT NULL → string, vždy tam bude
  appointment_date: string;      // DATE → string (React/JS pracuje s datumem jako stringem)
  appointment_time: string;      // TIME → string
  note?: string;                 // TEXT, volitelné → string nebo undefined
  user_id?: number;              // INTEGER, volitelné → number nebo undefined
  customer_id?: number;          // INTEGER, volitelné → number nebo undefined
  customer_name_unregistered?: string; // VARCHAR, volitelné → pro neregistrované zákazníky
}

function AppointmentList() {

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // appointments = pole Appointment objektů
  // <Appointment[]> říká TypeScriptu "toto pole bude obsahovat Appointment objekty"
  // výchozí hodnota = prázdné pole []

  const [showPast, setShowPast] = useState<boolean>(false);
  // showPast = přepínač pro zobrazení historie
  // boolean — true nebo false, výchozí false

  const [deleteId, setDeleteId] = useState<number | null>(null);
  // deleteId = id termínu který chceme smazat
  // number | null = číslo NEBO null (null = žádný termín není vybraný)

  useEffect(() => {
    // useEffect se spustí po načtení komponenty — jeden krát
    fetchWithAuth(`${API_URL}/api/appointments`)
      .then((res) => res.json())
      // res = Response objekt, .json() převede odpověď na JavaScript objekt
      .then((data) => setAppointments(data));
      // data = pole termínů z backendu, uložíme do state
  }, []);
  // [] = prázdné závislosti = spustí se jen jednou po načtení

  const handleDelete = async (id: number): Promise<void> => {
  // id: number = přijímáme číslo (id termínu)
  // Promise<void> = async funkce která nic nevrací
    await fetchWithAuth(`${API_URL}/api/appointments/${id}`, {
      method: "DELETE",
      // pošleme DELETE request na backend
    });
    setAppointments(appointments.filter((a) => a.id !== id));
    // filter = vytvoří nové pole bez smazaného termínu
    // a.id !== id = ponech všechny termíny KROMĚ toho se smazaným id
    setDeleteId(null);
    // zavřeme potvrzovací modal
    toast.success("Termín smazán!");
  };

  const today = new Date();
  // today = dnešní datum jako Date objekt
  today.setHours(0, 0, 0, 0);
  // nastavíme čas na půlnoc aby se porovnávala jen data, ne časy

  const next7days = new Date(today);
  // kopie dnešního data
  next7days.setDate(today.getDate() + 7);
  // přičteme 7 dní = konec "tohoto týdne"

  const upcoming = appointments.filter((a: Appointment) => {
  // filter projde všechny termíny a vrátí jen ty které splňují podmínku
    const d = new Date(a.appointment_date);
    // převedeme string datum na Date objekt pro porovnání
    return d >= today && d <= next7days;
    // termín je "tento týden" pokud je mezi dnes a za 7 dní
  });

  const future = appointments.filter(
    (a: Appointment) => new Date(a.appointment_date) > next7days,
    // budoucí termíny = po příštích 7 dnech
  );

  const past = appointments.filter(
    (a: Appointment) => new Date(a.appointment_date) < today,
    // minulé termíny = před dneškem
  );

  const groupByDate = (list: Appointment[]): Record<string, Appointment[]> => {
  // list: Appointment[] = bere pole termínů
  // Record<string, Appointment[]> = vrací objekt kde:
  //   klíč = string (datum např. "1. 4. 2026")
  //   hodnota = pole termínů pro ten den
    return list.reduce(
      (groups: Record<string, Appointment[]>, a: Appointment) => {
      // reduce = projde pole a skládá výsledek do jednoho objektu (groups)
        const date = new Date(a.appointment_date).toLocaleDateString("cs-CZ");
        // převede datum na český formát — "1. 4. 2026"
        if (!groups[date]) groups[date] = [];
        // pokud pro toto datum ještě nemáme skupinu, vytvoříme prázdné pole
        groups[date].push(a);
        // přidáme termín do správné skupiny
        return groups;
      },
      {},
      // výchozí hodnota = prázdný objekt
    );
  };

  const renderGroup = (groups: Record<string, Appointment[]>) => {
  // groups = objekt s termíny seskupenými podle data
    return Object.entries(groups).map(([date, items]) => (
    // Object.entries = převede objekt na pole párů [klíč, hodnota]
    // [date, items] = destrukturujeme — date = datum, items = termíny pro ten den
      <div key={date} className="mb-6">
        <div
          style={{ color: "var(--accent)" }}
          className="text-xs font-medium uppercase tracking-widest mb-3"
        >
          {date}
          {/* zobrazíme datum jako nadpis skupiny */}
        </div>
        {items.map((a: Appointment) => (
        // mapujeme přes termíny v dané skupině
          <div
            key={a.id}
            // key = unikátní identifikátor pro React — použijeme id termínu
            style={{
              borderLeftColor: "var(--accent)",
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius-sm)",
              clipPath: "var(--btn-clip)",
            }}
            className="border border-l-2 px-4 py-4 mb-2"
          >
            <div className="flex justify-between items-center">
              <strong
                style={{ color: "var(--text-primary)" }}
                className="font-medium"
              >
                {a.customer_name}
                {/* jméno zákazníka — přišlo z COALESCE v SQL */}
              </strong>
              <span style={{ color: "var(--accent)" }} className="text-sm">
                {a.service_name}
                {/* název služby */}
              </span>
            </div>
            <div
              style={{ color: "var(--text-muted)" }}
              className="text-xs mt-2"
            >
              {a.appointment_time.slice(0, 5)}
              {/* .slice(0, 5) = zobrazíme jen HH:MM, bez sekund */}
            </div>
            {a.note && (
            // zobrazíme poznámku jen pokud existuje
              <div
                style={{ color: "var(--text-muted)" }}
                className="text-xs mt-1"
              >
                {a.note}
              </div>
            )}
            <button
              onClick={() => setDeleteId(a.id)}
              // uložíme id termínu do state — otevře potvrzovací modal
              style={{ color: "var(--text-muted)" }}
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
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius)",
      }}
      className="max-w-xl mx-auto mt-6 border p-8 mb-6"
    >
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-xl font-medium mb-6 tracking-widest uppercase"
      >
        Termíny
      </h2>

      <h3
        style={{ color: "var(--text-muted)" }}
        className="text-xs font-medium mb-4 tracking-widest uppercase"
      >
        Tento týden
      </h3>
      {upcoming.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }} className="mb-4 text-sm">
          Žádné termíny tento týden
        </p>
      ) : (
        renderGroup(groupByDate(upcoming))
        // seskupíme termíny podle data a vykreslíme
      )}

      {future.length > 0 && (
        // zobrazíme sekci budoucích termínů jen pokud nějaké existují
        <>
          <h3
            style={{ color: "var(--text-muted)" }}
            className="text-xs font-medium mt-6 mb-4 tracking-widest uppercase"
          >
            Budoucí termíny
          </h3>
          <div>{renderGroup(groupByDate(future))}</div>
        </>
      )}

      <button
        onClick={() => setShowPast(!showPast)}
        // !showPast = překlopí boolean — true→false, false→true
        style={{ color: "var(--text-muted)" }}
        className="hover:opacity-80 text-xs mt-4 tracking-wide transition"
      >
        {showPast ? "▲ Skrýt historii" : "▼ Zobrazit historii"}
        {/* podmíněný text podle stavu showPast */}
      </button>

      {showPast && past.length > 0 && (
        // zobrazíme historii jen pokud showPast=true A existují minulé termíny
        <div className="mt-4 opacity-60">{renderGroup(groupByDate(past))}</div>
      )}

      {deleteId && (
        // zobrazíme modal jen pokud je vybrán termín ke smazání
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          {/* fixed inset-0 = překryje celou obrazovku */}
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="border p-8 max-w-sm w-full mx-4"
          >
            <h3
              style={{ color: "var(--text-primary)" }}
              className="text-lg font-medium mb-2 tracking-wide"
            >
              Smazat termín?
            </h3>
            <p
              style={{ color: "var(--text-muted)" }}
              className="text-sm mb-6"
            >
              Tato akce je nevratná.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                // zavoláme handleDelete s id termínu
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 flex-1 transition"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Smazat
              </button>
              <button
                onClick={() => setDeleteId(null)}
                // zrušíme výběr — zavře modal bez smazání
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-muted)",
                  borderRadius: "var(--radius-sm)",
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
// výchozí export — importuješ jako: import AppointmentList from './AppointmentList'
