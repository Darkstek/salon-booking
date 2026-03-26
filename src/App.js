import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import AddAppointment from './AddAppointment';
import AppointmentList from './AppointmentList';
import CustomerList from './CustomerList';
import Login from './Login';
import Profile from './Profile'; 
import PublicSearch from './PublicSearch';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [isGuest, setIsGuest] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  if (!isLoggedIn && !isGuest) {
    return (
      <>
        <Toaster position="top-right" />
        <Login onLogin={handleLogin} onGuest={() => setIsGuest(true)} />
      </>
    );
  }

if (isGuest) {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="*" element={<PublicSearch onBack={() => setIsGuest(false)} />} />
      </Routes>
    </BrowserRouter>
  );
}

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Header onLogout={handleLogout} />
        <div className="max-w-2xl mx-auto px-4">
          <Routes>
            <Route path="/" element={
              <>
                <AppointmentList />
                <AddAppointment />
              </>
            } />
            <Route path="/zakaznici" element={<CustomerList />} />
            <Route path="/profil" element={<Profile />} /> {/* 👈 NOVÉ: routa pro profil */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;