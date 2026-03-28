import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#0f1117] border-b border-white/5" style={{ position: 'relative', zIndex: 10 }}>
      <div className="flex items-center justify-between px-6 py-4">
        
        <div>
          <h1 className="text-lg font-medium text-white tracking-widest uppercase">
            Salon Booking
          </h1>
          <p className="text-xs text-gray-600 tracking-wider">Rezervace pro mámův salon</p>
        </div>

        {/* Desktop navigace - skrytá na mobilu */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className="text-gray-500 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition tracking-wide">
            Termíny
          </Link>
          <Link to="/zakaznici" className="text-gray-500 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition tracking-wide">
            Zákazníci
          </Link>
          {onLogout && (
            <Link to="/profil" className="text-gray-500 hover:text-white text-xs px-3 py-2 rounded-lg hover:bg-white/5 transition tracking-wide">
              Profil
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Odhlásit - skrytý na mobilu */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="hidden md:block text-xs text-gray-600 hover:text-blue-400 transition tracking-wide"
            >
              Odhlásit
            </button>
          )}

          {/* Hamburger tlačítko - viditelné jen na mobilu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block w-5 h-0.5 bg-gray-400 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-400 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-gray-400 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobilní menu - zobrazí se po kliknutí na hamburger */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white text-sm py-2 tracking-wide transition"
          >
            Termíny
          </Link>
          <Link
            to="/zakaznici"
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white text-sm py-2 tracking-wide transition"
          >
            Zákazníci
          </Link>
          {onLogout && (
            <Link
              to="/profil"
              onClick={() => setMenuOpen(false)}
              className="text-gray-400 hover:text-white text-sm py-2 tracking-wide transition"
            >
              Profil
            </Link>
          )}
          {onLogout && (
            <button
              onClick={() => { onLogout(); setMenuOpen(false); }}
              className="text-left text-gray-600 hover:text-blue-400 text-sm py-2 tracking-wide transition"
            >
              Odhlásit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;