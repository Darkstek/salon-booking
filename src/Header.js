import { Link } from 'react-router-dom';

function Header({ onLogout }) {
  return (
    <div className="bg-[#0f1117] border-b border-white/5 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-medium text-white tracking-widest uppercase">
          Salon Booking
        </h1>
        <p className="text-xs text-gray-600 tracking-wider">Rezervace pro mámův salon</p>
      </div>

      <div className="flex items-center gap-1">
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

      {onLogout && (
        <button
          onClick={onLogout}
          className="text-xs text-gray-600 hover:text-blue-400 transition tracking-wide"
        >
          Odhlásit
        </button>
      )}
    </div>
  );
}

export default Header;