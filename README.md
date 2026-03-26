# Salon Booking

Fullstack webová aplikace pro správu rezervací a zákazníků v kosmetickém salonu. Projekt vznikl jako reálné řešení pro rodinný podnik — cílem bylo nahradit předražené SaaS alternativy funkční vlastní aplikací.

**Live Demo:** [salon-booking.vercel.app](https://salon-booking-ashy.vercel.app/)  
**Backend:** [github.com/Darkstek/salon-server](https://github.com/Darkstek/salon-server)

> Demo přihlášení pro recruitery  
> Email: `mama@salon.cz`  
> Heslo: `heslo123`

---

## O projektu

Projekt jsem stavěl od nuly — od návrhu databázového schématu přes REST API až po React frontend a deployment. Šlo mi především o to pochopit jak spolu jednotlivé vrstvy aplikace komunikují a jak vypadá reálný vývojový proces.

Aplikace je aktivně používána a průběžně rozšiřována na základě zpětné vazby uživatele.

---

## Tech Stack

| Vrstva | Technologie |
|--------|-------------|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Databáze | PostgreSQL |
| Autentizace | JWT, bcrypt |
| Hosting | Vercel (frontend), Railway (backend + DB) |
| Verzování | Git, GitHub |

---

## Funkce

- Přihlašování s JWT autentizací a hashováním hesel přes bcrypt
- Správa zákazníků — přidání, smazání, zobrazení historie návštěv a nadcházejících schůzek
- Správa termínů — přidání, smazání, řazení podle data, oddělení nadcházejících a minulých
- Veřejná stránka se službami a ceníkem bez nutnosti přihlášení
- Responzivní design fungující na mobilu i desktopu
- Toast notifikace místo nativních alert dialogů
- Potvrzovací modální okna pro destruktivní akce

---

## Architektura

Aplikace je rozdělena do dvou samostatných projektů — frontend nasazený na Vercelu a backend s databází na Railway. Komunikace probíhá přes REST API.

```
salon-booking/               React frontend (Vercel)
├── src/
│   ├── App.js               Routing, auth state management
│   ├── Login.js             JWT přihlášení
│   ├── Header.js            Navigace s React Router
│   ├── AppointmentList.js   Seznam termínů s grupováním po dnech
│   ├── AddAppointment.js    Formulář pro přidání termínu
│   ├── CustomerList.js      Správa zákazníků s historií
│   └── Services.js          Veřejný ceník

salon-server/                Node.js backend (Railway)
├── index.js                 Express server, REST API endpoints
├── setupDb.js               Inicializace databáze
└── createUser.js            Skript pro vytvoření uživatele
```

---

## REST API

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| POST | `/api/login` | Přihlášení, vrátí JWT token |
| GET | `/api/customers` | Seznam zákazníků |
| POST | `/api/customers` | Přidání zákazníka |
| DELETE | `/api/customers/:id` | Smazání zákazníka |
| GET | `/api/customers/:id/detail` | Historie a nadcházející schůzky zákazníka |
| GET | `/api/appointments` | Seznam termínů |
| POST | `/api/appointments` | Přidání termínu |
| DELETE | `/api/appointments/:id` | Smazání termínu |

---

## Databázové schéma

```sql
customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  service_name VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## Lokální spuštění

### Požadavky
- Node.js v18+
- PostgreSQL

### Frontend
```bash
git clone https://github.com/Darkstek/salon-booking
cd salon-booking
npm install
npm start
```

### Backend
```bash
git clone https://github.com/Darkstek/salon-server
cd salon-server
npm install
node setupDb.js
node createUser.js
npm run dev
```

---

## Co jsem se naučil

Tento projekt mi dal praktickou zkušenost s věcmi, které se v kurzech těžko naučíš — jak navrhnout API které dává smysl, jak řešit autentizaci bezpečně, jak ladit problémy mezi frontendem a backendem a jak celou aplikaci dostat na produkci. Důraz jsem kladl na pochopení každého řádku kódu, ne jen na funkční výsledek.

---

## Autor

Student softwarového vývoje na Unicorn University  
[GitHub](https://github.com/Darkstek)
