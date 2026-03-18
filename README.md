# 💅 Salon Booking App

Fullstack webová aplikace pro správu rezervací a zákazníků v kosmetickém salonu. Projekt byl vytvořen jako reálná aplikace pro rodinný podnik s cílem nahradit placené SaaS řešení.

**🔗 Live Demo:** [salon-booking.vercel.app](https://salon-booking.vercel.app)  
**📦 Backend Repo:** [github.com/Darkstek/salon-server](https://github.com/Darkstek/salon-server)

> 🔑 **Demo přihlášení pro recruitery:**  
> Email: `mama@salon.cz`  
> Heslo: `heslo123`

---

## 🛠️ Tech Stack

| Vrstva | Technologie |
|--------|-------------|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Databáze | PostgreSQL |
| Autentizace | JWT (JSON Web Tokens), bcrypt |
| Hosting | Vercel (frontend), Railway (backend + DB) |
| Verzování | Git, GitHub |

---

## ✨ Funkce

- 🔐 **Přihlašování** — JWT autentizace, hashování hesel přes bcrypt
- 👥 **Správa zákazníků** — přidání, zobrazení, smazání zákazníků s poznámkami
- 📅 **Správa termínů** — přidání termínů, řazení podle data, oddělení nadcházejících a minulých
- 🗑️ **Mazání** — potvrzovací dialog pro smazání termínů i zákazníků
- 👁️ **Guest mód** — veřejná stránka se službami a ceníkem bez přihlášení
- 🔔 **Toast notifikace** — uživatelsky přívětivé notifikace místo alert()
- 📱 **Responzivní design** — funguje na mobilu i desktopu

---

## 🏗️ Architektura

```
salon-booking/          # React frontend (Vercel)
├── src/
│   ├── App.js          # Routing, auth state
│   ├── Login.js        # JWT přihlášení
│   ├── Header.js       # Navigace
│   ├── AppointmentList.js  # Seznam termínů
│   ├── AddAppointment.js   # Formulář pro termín
│   ├── CustomerList.js     # Správa zákazníků
│   └── Services.js     # Veřejný ceník

salon-server/           # Node.js backend (Railway)
├── index.js            # Express server, REST API
├── createUser.js       # Skript pro vytvoření uživatele
└── setupDb.js          # Inicializace databáze
```

---

## 🔌 REST API Endpoints

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| POST | `/api/login` | Přihlášení, vrátí JWT token |
| GET | `/api/customers` | Seznam všech zákazníků |
| POST | `/api/customers` | Přidání zákazníka |
| DELETE | `/api/customers/:id` | Smazání zákazníka |
| GET | `/api/appointments` | Seznam všech termínů |
| POST | `/api/appointments` | Přidání termínu |
| DELETE | `/api/appointments/:id` | Smazání termínu |

---

## 🗄️ Databázové schéma

```sql
customers (id, name, phone, note, created_at)
appointments (id, customer_id, service_name, appointment_date, appointment_time, note, created_at)
users (id, email, password, created_at)
```

---

## 🚀 Lokální spuštění

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
node setupDb.js    # Vytvoří tabulky
node createUser.js # Vytvoří admin účet
npm run dev
```

---

## 💡 Co jsem se naučil

- Návrh a implementace REST API v Node.js + Express
- JWT autentizace a bezpečné hashování hesel
- Práce s PostgreSQL a psaní SQL dotazů
- Propojení React frontendu s backendem přes fetch API
- React hooks — useState, useEffect, props
- Deployment fullstack aplikace (Vercel + Railway)
- Git workflow a správa více repozitářů

---

## 📸 Screenshots

> *Přihlašovací stránka, správa termínů, seznam zákazníků*

---

## 👤 Autor

**Darkstek** — student softwarového vývoje na Unicorn University  
[GitHub](https://github.com/Darkstek)
