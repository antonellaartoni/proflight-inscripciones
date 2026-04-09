function InscriptoRow({ inscripcion, nombreCurso, onCancelar, mostrarCurso }) {
  const handleCancelar = () => {
    // Pedimos confirmación porque la cancelación es irreversible en este sistema.
    const confirmar = window.confirm(
      `¿Cancelar la inscripción de ${inscripcion.nombre} ${inscripcion.apellido}?`
    );
    if (confirmar) onCancelar(inscripcion.id);
  };

  return (
    <tr className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors duration-100">
      <td className="py-3 px-4 text-sm text-white/80">
        {inscripcion.apellido}, {inscripcion.nombre}
      </td>
      <td className="py-3 px-4 text-sm text-white/50 font-mono">
        {inscripcion.dni}
      </td>
      <td className="py-3 px-4 text-sm text-white/50">
        {inscripcion.email}
      </td>
      <td className="py-3 px-4 text-sm text-white/60">
        <div className="flex flex-col gap-1">
          {mostrarCurso && <span>{nombreCurso}</span>}
          {inscripcion.docDni          && <Badge color="blue"  texto={inscripcion.docDni} />}
          {inscripcion.docSecundario   && <Badge color="blue"  texto={inscripcion.docSecundario} />}
          {inscripcion.licenciaArchivo && <Badge color="gold"  texto={inscripcion.licenciaArchivo} />}
          {inscripcion.licenciaComercial   && <Badge color="gold" texto={inscripcion.licenciaComercial} />}
          {inscripcion.licenciaHelicoptero && <Badge color="gold" texto={inscripcion.licenciaHelicoptero} />}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-white/30">
        {inscripcion.fechaInscripcion}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={handleCancelar}
          className="text-xs font-medium text-red-400/70 hover:text-red-400
            hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all duration-150
            border border-transparent hover:border-red-500/20"
        >
          Cancelar
        </button>
      </td>
    </tr>
  );
}

function Badge({ color, texto }) {
  const estilos = {
    blue: "text-white/50 bg-white/[0.06] border-white/10",
    gold: "text-gold-400/80 bg-gold-500/10 border-gold-500/20",
  };
  return (
    <span className={`inline-flex items-center text-xs border rounded-md px-1.5 py-0.5 w-fit ${estilos[color]}`}>
      {texto}
    </span>
  );
}

export default InscriptoRow;
