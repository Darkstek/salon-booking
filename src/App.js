import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import AddAppointment from './AddAppointment';
import AppointmentList from './AppointmentList';
import CustomerList from './CustomerList';
import Login from './Login';
import Profile from './Profile'; 
import PublicSearch from './PublicSearch';
import PublicProfile from './PublicProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );
  const [isGuest, setIsGuest] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'green'
  );

  useEffect(() => {
    // Při každé změně theme nastavíme data-theme na <html> element
    if (theme === 'green') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleThemeChange = (newTheme) => setTheme(newTheme);
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
        <Route path="/" element={<PublicSearch onBack={() => setIsGuest(false)} />} />
        <Route path="/salon/:id" element={<PublicProfile />} />
        <Route path="*" element={<PublicSearch onBack={() => setIsGuest(false)} />} />
      </Routes>
    </BrowserRouter>
  );
}

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ 
          backgroundColor: 'var(--bg-primary)',
          backgroundImage: 'url(/nightcity.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
            }}>
        <Toaster position="top-right" />
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-primary)',
          opacity: 0.65,
          zIndex: 0,
          pointerEvents: 'none',
            }} />
        <Header onLogout={handleLogout} theme={theme} onThemeChange={handleThemeChange} />
        <div className="max-w-2xl mx-auto px-4" style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={
              <>
                <AppointmentList />
                <AddAppointment />
              </>
            } />
            <Route path="/zakaznici" element={<CustomerList />} />
            <Route path="/profil" element={<Profile onThemeChange={handleThemeChange} theme={theme} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;