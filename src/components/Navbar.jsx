import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/cursos",      label: "Cursos"      },
  { path: "/inscripcion", label: "Inscripción" },
  { path: "/inscriptos",  label: "Inscriptos"  },
  { path: "/dashboard",   label: "Dashboard"   },
];

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-black/60 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gold-500/20 border border-gold-500/30
              flex items-center justify-center">
              <span className="text-gold-400 text-xs font-bold">PF</span>
            </div>
            <span className="font-bold text-white tracking-wide text-base">
              Pro<span className="text-gold-400">Flight</span>
            </span>
          </div>

          <div className="flex gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
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
