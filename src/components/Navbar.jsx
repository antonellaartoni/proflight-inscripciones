import { Link, useLocation } from "react-router-dom";

// Array de links para que agregar una sección nueva sea un cambio de una línea.
const navLinks = [
  { path: "/cursos",      label: "Cursos"      },
  { path: "/inscripcion", label: "Inscripción" },
  { path: "/inscriptos",  label: "Inscriptos"  },
  { path: "/dashboard",   label: "Dashboard"   },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-2">
            <span className="text-2xl">✈️</span>
            <span className="font-bold text-slate-800 text-lg">ProFlight</span>
          </div>

          <div className="flex gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
