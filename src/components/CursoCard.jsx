import { Link } from "react-router-dom";

function CursoCard({ curso, cuposDisponibles }) {
  const estaLleno = cuposDisponibles === 0;

  const porcentajeOcupado = Math.round(
    ((curso.cupoMaximo - cuposDisponibles) / curso.cupoMaximo) * 100
  );

  const colorBarra =
    estaLleno          ? "bg-red-500/70"
    : porcentajeOcupado >= 70 ? "bg-gold-600/80"
    : "bg-gold-500";

  return (
    <div className={`
      bg-white/[0.04] backdrop-blur-md rounded-2xl border p-6 flex flex-col gap-4
      transition-all duration-200 hover:bg-white/[0.07]
      ${estaLleno ? "border-white/[0.06] opacity-60" : "border-white/[0.08] hover:border-gold-500/20"}
    `}>

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-lg leading-tight">
          {curso.nombre}
        </h3>
        <span className={`
          text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap border
          ${estaLleno
            ? "bg-red-500/10 text-red-400 border-red-500/20"
            : "bg-gold-500/10 text-gold-400 border-gold-500/20"}
        `}>
          {estaLleno ? "Cupo lleno" : "Disponible"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-white/50">
        <span>Duración: <strong className="text-white/80 font-medium">{curso.duracion}</strong></span>
        <span>Cupo máximo: <strong className="text-white/80 font-medium">{curso.cupoMaximo} alumnos</strong></span>
        <span>Cupos disponibles: <strong className={estaLleno ? "text-red-400" : "text-gold-400"}>
          {cuposDisponibles}
        </strong></span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs text-white/30">
          <span>Ocupación</span>
          <span>{porcentajeOcupado}%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
            style={{ width: `${porcentajeOcupado}%` }}
          />
        </div>
      </div>

      <div className="mt-auto pt-2">
        {estaLleno ? (
          <span className="block text-center w-full py-2.5 px-4 rounded-xl
            bg-white/[0.04] text-white/30 text-sm font-medium border border-white/[0.06] cursor-not-allowed">
            Sin cupos disponibles
          </span>
        ) : (
          <Link
            to={`/inscripcion?cursoId=${curso.id}`}
            className="block text-center w-full py-2.5 px-4 rounded-xl
              bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold
              transition-colors duration-150"
          >
            Inscribirse
          </Link>
        )}
      </div>

    </div>
  );
}

export default CursoCard;
