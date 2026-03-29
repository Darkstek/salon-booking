# Salon Booking

Fullstack webová aplikace pro správu rezervací a zákazníků v kosmetickém salonu. Vznikla jako reálné řešení pro rodinný podnik — cílem bylo nahradit předražené SaaS alternativy něčím vlastním, co přesně odpovídá potřebám konkrétního provozu.

**Live Demo:** [salon-booking-ashy.vercel.app](https://salon-booking-ashy.vercel.app/)  
**Backend:** [github.com/Darkstek/salon-server](https://github.com/Darkstek/salon-server)

> Demo přihlášení pro recruitery  
> Email: `mama@salon.cz`  
> Heslo: `heslo123`

---

## O projektu

Stavěl jsem to od nuly — od návrhu databázového schématu přes REST API až po React frontend a deployment na produkci. Projekt je aktivně používán a průběžně rozšiřován podle zpětné vazby od uživatele.

Víc než na výsledek mi šlo o pochopení toho, jak celý stack funguje dohromady. Narazil jsem na věci které se v kurzech moc neřeší — multi-tenant architektura, OAuth flow, PWA, nebo ladění problémů mezi frontendem a backendem v produkci.

---

## Tech Stack

| Vrstva | Technologie |
|--------|-------------|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Databáze | PostgreSQL |
| Autentizace | JWT, Google OAuth |
| Hosting | Vercel (frontend), Railway (backend + DB) |
| Verzování | Git, GitHub |

---

## Funkce

- Přihlašování přes Google OAuth a JWT
- Správa zákazníků — přidání, smazání, abecední řazení, vyhledávání, historie návštěv
- Správa termínů — přidání, smazání, řazení podle data, oddělení nadcházejících a minulých
- Podnikatelský profil — název, kontakt, adresa, popis, vlastní ceník služeb
- Veřejný vyhledávač salonů s profilem každého podnikatele
- Theme switcher — 4 barevná schémata (Default, Blue, Pink, Cyberpunk) × 2 módy (Dark, Light)
- PWA — appka jde přidat na plochu mobilu jako nativní aplikace
- Responzivní design s hamburger menu na mobilu
- Toast notifikace a potvrzovací modály pro destruktivní akce

---

## Architektura

Frontend je nasazený na Vercelu, backend s databází na Railway. Komunikace probíhá přes REST API.
```
salon-booking/               React frontend (Vercel)
├── src/
│   ├── App.js               Routing, auth state, theme management
│   ├── Login.js             Google OAuth přihlášení
│   ├── Header.js            Navigace s hamburger menu
│   ├── AppointmentList.js   Seznam termínů
│   ├── AddAppointment.js    Přidání termínu s vyhledáváním zákazníků
│   ├── CustomerList.js      Správa zákazníků s historií
│   ├── Profile.js           Profil podnikatele + služby + theme switcher
│   ├── PublicSearch.js      Veřejný vyhledávač salonů
│   └── PublicProfile.js     Veřejný profil salonu

salon-server/                Node.js backend (Railway)
├── index.js                 Express server, REST API
├── setupDb.js               Inicializace databáze
└── createUser.js            Skript pro vytvoření uživatele
```

---

## REST API

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| POST | `/api/auth/google` | Google OAuth přihlášení |
| POST | `/api/login` | Přihlášení emailem, vrátí JWT |
| GET | `/api/customers` | Seznam zákazníků |
| POST | `/api/customers` | Přidání zákazníka |
| DELETE | `/api/customers/:id` | Smazání zákazníka |
| GET | `/api/customers/:id/detail` | Historie a nadcházející schůzky |
| GET | `/api/appointments` | Seznam termínů |
| POST | `/api/appointments` | Přidání termínu |
| DELETE | `/api/appointments/:id` | Smazání termínu |
| GET | `/api/profile` | Načtení profilu podnikatele |
| POST | `/api/profile` | Uložení profilu |
| GET | `/api/profiles/public` | Veřejný seznam všech salonů |
| GET | `/api/services/:userId` | Služby konkrétního salonu |
| POST | `/api/services` | Přidání služby |
| DELETE | `/api/services/:id` | Smazání služby |

---

## Databázové schéma
```sql
users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
)

customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  customer_id INTEGER REFERENCES customers(id),
  service_name VARCHAR(100) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  business_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

services (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  price INTEGER,
  duration INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## Lokální spuštění

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
npm run dev
```

---

## Co jsem se naučil

Tohle byl první projekt kde jsem musel vyřešit všechno sám — od databázového návrhu přes autentizaci až po produkční deployment. Narazil jsem na věci které se v kurzech moc neřeší, jako multi-tenant architektura, OAuth flow, PWA nebo ladění problémů mezi frontendem a backendem v produkci. Důraz jsem kladl na to aby mi každý řádek kódu dával smysl, ne jen aby to nějak fungovalo.

---

## Autor

Student softwarového vývoje na Unicorn University  
[GitHub](https://github.com/Darkstek)