import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Services from './Services';
import AddAppointment from './AddAppointment';
import AppointmentList from './AppointmentList';
import CustomerList from './CustomerList';
import Login from './Login';

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
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Header onLogout={null} />
        <div className="max-w-2xl mx-auto px-4">
          <Services />
          <div className="text-center mt-6 mb-10">
            <button
              onClick={() => setIsGuest(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ← Zpět na přihlášení
            </button>
          </div>
        </div>
      </div>
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;