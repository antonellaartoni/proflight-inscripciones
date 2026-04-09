import { useApp } from "../context/AppContext";

const roles = [
  {
    id: "alumno",
    monograma: "AL",
    titulo: "Alumno",
    descripcion: "Explorá los cursos disponibles y completá tu inscripción en línea.",
    accesos: ["Cursos", "Inscripción"],
  },
  {
    id: "admin",
    monograma: "AD",
    titulo: "Administrador",
    descripcion: "Gestioná inscripciones, revisá documentación y accedé al panel de estadísticas.",
    accesos: ["Cursos", "Inscripción", "Inscriptos", "Dashboard"],
  },
];

function SelectorRol() {
  const { dispatch } = useApp();

  const handleSeleccionar = (rolId) => {
    dispatch({ type: "SET_ROL", payload: { rol: rolId } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-10 w-full max-w-2xl">

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30
            flex items-center justify-center">
            <span className="text-gold-400 text-lg font-bold">PF</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white tracking-wide">
              Pro<span className="text-gold-400">Flight</span>
            </span>
            <p className="text-white/40 text-sm mt-1">
              Seleccioná tu perfil para continuar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {roles.map((rol) => (
            <button
              key={rol.id}
              onClick={() => handleSeleccionar(rol.id)}
              className="group bg-white/[0.04] backdrop-blur-md border border-white/[0.08]
                rounded-2xl p-6 text-left flex flex-col gap-4
                hover:border-gold-500/30 hover:bg-gold-500/[0.04]
                transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/20
                  flex items-center justify-center
                  group-hover:bg-gold-500/20 group-hover:border-gold-500/40 transition-all duration-200">
                  <span className="text-gold-400 text-xs font-bold">{rol.monograma}</span>
                </div>
                <span className="text-white font-semibold text-base">{rol.titulo}</span>
              </div>

              <p className="text-white/50 text-sm leading-relaxed">{rol.descripcion}</p>

              <div className="flex flex-col gap-2">
                <p className="text-white/30 text-xs uppercase tracking-wide font-semibold">
                  Secciones disponibles
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {rol.accesos.map((acceso) => (
                    <span
                      key={acceso}
                      className="text-xs px-2 py-0.5 rounded-md bg-white/[0.06] text-white/50
                        group-hover:bg-gold-500/10 group-hover:text-gold-400/70 transition-all duration-200"
                    >
                      {acceso}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-white/20 text-xs text-center">
          Esta selección no requiere autenticación — es solo para adaptar la interfaz a tu perfil.
        </p>

      </div>
    </div>
  );
}

export default SelectorRol;
