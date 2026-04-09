import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const navLinks = [
  { path: "/cursos",      label: "Cursos",      roles: ["alumno", "admin"] },
  { path: "/inscripcion", label: "Inscripción", roles: ["alumno", "admin"] },
  { path: "/inscriptos",  label: "Inscriptos",  roles: ["admin"] },
  { path: "/dashboard",   label: "Dashboard",   roles: ["admin"] },
];

function Navbar() {
  const { pathname } = useLocation();
  const { state, dispatch } = useApp();

  const linksFiltrados = navLinks.filter((link) => link.roles.includes(state.rol));

  const handleCambiarRol = () => {
    dispatch({ type: "SET_ROL", payload: { rol: null } });
  };

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

          <div className="flex items-center gap-1">
            {linksFiltrados.map((link) => {
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

            <div className="w-px h-4 bg-white/[0.08] mx-1" />

            <button
              onClick={handleCambiarRol}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
            >
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md
                bg-white/[0.06] text-white/40 uppercase tracking-wide">
                {state.rol === "admin" ? "AD" : "AL"}
              </span>
              Cambiar rol
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
