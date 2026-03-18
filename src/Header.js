import { Link } from 'react-router-dom';

function Header({ onLogout }) {
  return (
    <div className="bg-gray-900 py-6 text-center shadow-lg relative">
      <h1 className="text-3xl font-bold text-pink-300">
        💅 Salon Booking
      </h1>
      <p className="text-gray-400 mt-1">Rezervace pro mámův salon</p>
      <div className="flex justify-center gap-6 mt-3">
        <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
          📅 Termíny
        </Link>
        <Link to="/zakaznici" className="text-gray-400 hover:text-white text-sm transition">
          👥 Zákazníci
        </Link>
      </div>
      {onLogout && (
        <button
          onClick={onLogout}
          className="absolute right-6 top-6 text-gray-400 hover:text-white text-sm"
        >
          Odhlásit
        </button>
      )}
    </div>
  );
}

export default Header;