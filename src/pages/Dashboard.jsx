import { useApp } from "../context/AppContext";

function Dashboard() {
  const { state, getCuposDisponibles } = useApp();

  const totalInscriptos = state.inscripciones.length;
  const totalCupos = state.cursos.reduce((acc, curso) => acc + curso.cupoMaximo, 0);
  const cuposLibres = state.cursos.reduce((acc, curso) => acc + getCuposDisponibles(curso.id), 0);
  const cursosLlenos = state.cursos.filter((curso) => getCuposDisponibles(curso.id) === 0).length;

  const resumenPorCurso = state.cursos
    .map((curso) => {
      const inscriptos = state.inscripciones.filter((i) => i.cursoId === curso.id).length;
      const cuposLibresCurso = getCuposDisponibles(curso.id);
      const porcentaje = Math.round((inscriptos / curso.cupoMaximo) * 100);
      return { ...curso, inscriptos, cuposLibresCurso, porcentaje };
    })
    .sort((a, b) => b.inscriptos - a.inscriptos);

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm">Resumen general del estado de inscripciones.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricaCard valor={totalInscriptos} label="Inscriptos totales" />
        <MetricaCard valor={cuposLibres} label={`Cupos libres de ${totalCupos}`} />
        <MetricaCard
          valor={cursosLlenos}
          label={`Curso${cursosLlenos !== 1 ? "s" : ""} con cupo lleno`}
          alerta={cursosLlenos > 0}
        />
      </div>

      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Demanda por curso</h2>
          <p className="text-white/30 text-xs mt-0.5">Ordenado de mayor a menor demanda</p>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {resumenPorCurso.map((curso) => {
            const colorBarra =
              curso.porcentaje === 100 ? "bg-red-500/70"
              : curso.porcentaje >= 70  ? "bg-gold-600/80"
              : "bg-gold-500";

            return (
              <div key={curso.id} className="px-6 py-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-white/80 text-sm">{curso.nombre}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {curso.inscriptos} inscripto{curso.inscriptos !== 1 ? "s" : ""} · {curso.cuposLibresCurso} cupo{curso.cuposLibresCurso !== 1 ? "s" : ""} libre{curso.cuposLibresCurso !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${curso.porcentaje === 100 ? "text-red-400" : "text-gold-400"}`}>
                    {curso.porcentaje}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
                    style={{ width: `${curso.porcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function MetricaCard({ valor, label, alerta = false }) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-5
      hover:border-gold-500/20 transition-all duration-200">
      <p className={`text-3xl font-bold leading-none ${alerta && valor > 0 ? "text-red-400" : "text-gold-400"}`}>
        {valor}
      </p>
      <p className="text-white/40 text-sm mt-2">{label}</p>
    </div>
  );
}

export default Dashboard;
