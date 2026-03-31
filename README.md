# Zerio

Booking appka kterou jsem postavil pro mámův kosmetický salon. Začalo to tím, že jsem se podíval kolik stojí normální řešení na trhu — 600 až 1000 Kč měsíčně za věci které ani nepotřebuje. Tak jsem to postavil sám.

**Live:** [salon-booking-ashy.vercel.app](https://salon-booking-ashy.vercel.app/)

> Demo přihlášení: `mama@salon.cz` / `heslo123`

---

## Co to umí

Mamka si přes appku zapisuje zákazníky a termíny, místo aby to psala do sešitu nebo platila za předražený SaaS. Zákazníci si navíc můžou sami najít salon ve veřejném vyhledávači a zarezervovat si termín online.

- přihlášení přes Google nebo email
- správa zákazníků — přidání, smazání, vyhledávání, historie návštěv
- termíny — zápis, mazání, rozdělení na tento týden / budoucí / historie
- profil salonu s ceníkem služeb
- nastavení pracovní doby a délky slotů
- veřejný vyhledávač salonů
- online booking pro zákazníky přes veřejný profil
- theme switcher — 4 barevná schémata × dark/light mód
- PWA — jde přidat na plochu mobilu
- responzivní design s hamburger menu

---

## Stack

| | |
|---|---|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Databáze | PostgreSQL |
| Auth | JWT, Google OAuth |
| Hosting | Vercel + Railway |

---

## Architektura

Multi-tenant — každý podnikatel vidí jen svoje zákazníky a termíny. Veřejná část (vyhledávač, profily, booking) běží bez přihlášení.

```
salon-booking/               frontend (Vercel)
├── src/
│   ├── App.js               routing, auth, theme
│   ├── Login.js             přihlášení
│   ├── Header.js            navigace
│   ├── AppointmentList.js   seznam termínů
│   ├── AddAppointment.js    přidání termínu
│   ├── CustomerList.js      zákazníci
│   ├── Profile.js           profil + služby + dostupnost + vzhled
│   ├── PublicSearch.js      vyhledávač salonů
│   └── PublicProfile.js     veřejný profil + booking

salon-server/                backend (Railway)
├── index.js                 Express API
├── setupDb.js               inicializace DB
└── createUser.js            vytvoření uživatele
```

---

## API

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/login` | přihlášení emailem |
| GET | `/api/customers` | seznam zákazníků |
| POST | `/api/customers` | přidání zákazníka |
| DELETE | `/api/customers/:id` | smazání zákazníka |
| GET | `/api/customers/:id/detail` | historie zákazníka |
| GET | `/api/appointments` | seznam termínů |
| POST | `/api/appointments` | přidání termínu |
| DELETE | `/api/appointments/:id` | smazání termínu |
| GET | `/api/profile` | načtení profilu |
| POST | `/api/profile` | uložení profilu |
| GET | `/api/profiles/public` | veřejný seznam salonů |
| GET | `/api/services/:userId` | služby salonu |
| POST | `/api/services` | přidání služby |
| DELETE | `/api/services/:id` | smazání služby |
| GET | `/api/availability` | načtení dostupnosti |
| POST | `/api/availability` | uložení dostupnosti |
| GET | `/api/slots/:userId/:date` | volné sloty pro daný den |
| POST | `/api/bookings` | rezervace od zákazníka |

---

## Lokální spuštění

```bash
# frontend
git clone https://github.com/Darkstek/salon-booking
cd salon-booking
npm install
npm start

# backend
git clone https://github.com/Darkstek/salon-server
cd salon-server
npm install
node setupDb.js
npm run dev
```

---

## Co jsem se naučil

Tohle byl první projekt kde jsem řešil všechno od začátku do konce — návrh databáze, REST API, autentizace, deployment, produkční provoz. Nejvíc mě bavily věci co se v kurzech moc neřeší — multi-tenant logika, OAuth flow, nebo ladění problémů mezi frontendem a backendem přímo v produkci.

Projekt aktivně používám jako testovací prostředí — průběžně přidávám funkce podle reálné zpětné vazby od uživatele a postupně přepisuji kód do TypeScriptu.

---

*Student softwarového vývoje — Unicorn University | [GitHub](https://github.com/Darkstek)*