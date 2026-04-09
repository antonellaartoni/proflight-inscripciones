import { useApp } from "../context/AppContext";
import CursoCard from "../components/CursoCard";

function ListaCursos() {
  const { state, getCuposDisponibles } = useApp();

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Cursos disponibles</h1>
        <p className="text-white/40 text-sm">
          Explorá nuestra oferta de formación aeronáutica y elegí el curso que mejor se adapta a tus objetivos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.cursos.map((curso) => (
          <CursoCard
            key={curso.id}
            curso={curso}
            cuposDisponibles={getCuposDisponibles(curso.id)}
          />
        ))}
      </div>

      {/* Bloque de contacto — aparece al final de la lista de cursos,
          donde el usuario está evaluando opciones y es más probable que tenga dudas. */}
      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08]
        hover:border-gold-500/20 rounded-2xl p-6 flex flex-col sm:flex-row
        items-start sm:items-center justify-between gap-4 transition-all duration-200">

        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold">¿Tenés dudas sobre algún curso?</p>
          <p className="text-white/40 text-sm">
            Contactanos y un instructor te va a asesorar sin compromiso.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end text-sm flex-shrink-0">
          <a
            href="mailto:info@proflight.com.ar"
            className="text-gold-400 hover:text-gold-300 transition-colors duration-150"
          >
            info@proflight.com.ar
          </a>
          <span className="text-white/40">+54 11 4320-7890</span>
        </div>

      </div>

    </div>
  );
}

export default ListaCursos;
