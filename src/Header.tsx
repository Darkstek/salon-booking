import { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLogout?: () => void;
}
function Header({ onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1
            style={{ color: "var(--text-primary)" }}
            className="text-lg font-medium tracking-widest uppercase"
          >
            Zerio
          </h1>
          <p
            style={{ color: "var(--text-muted)" }}
            className="text-xs tracking-wider"
          >
            Snadno a rychle
          </p>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {["/", "/zakaznici", "/profil"].map((path, i) => (
            <Link
              key={path}
              to={path}
              style={{ color: "var(--text-muted)" }}
              className="text-xs px-3 py-2 hover:opacity-100 transition tracking-wide"
            >
              {["Termíny", "Zákazníci", "Profil"][i]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {onLogout && (
            <button
              onClick={onLogout}
              style={{ color: "var(--text-muted)" }}
              className="hidden md:block text-xs hover:opacity-80 transition tracking-wide"
            >
              Odhlásit
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              style={{ backgroundColor: "var(--text-muted)" }}
              className={`block w-5 h-0.5 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              style={{ backgroundColor: "var(--text-muted)" }}
              className={`block w-5 h-0.5 transition-all ${menuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              style={{ backgroundColor: "var(--text-muted)" }}
              className={`block w-5 h-0.5 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{ borderTop: "1px solid var(--border)" }}
          className="md:hidden px-6 py-4 flex flex-col gap-2"
        >
          {["/", "/zakaznici", "/profil"].map((path, i) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              style={{ color: "var(--text-secondary)" }}
              className="text-sm py-2 tracking-wide transition hover:opacity-80"
            >
              {["Termíny", "Zákazníci", "Profil"][i]}
            </Link>
          ))}
          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                setMenuOpen(false);
              }}
              style={{ color: "var(--text-muted)" }}
              className="text-left text-sm py-2 tracking-wide transition hover:opacity-80"
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
