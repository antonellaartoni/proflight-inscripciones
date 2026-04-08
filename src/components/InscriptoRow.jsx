function InscriptoRow({ inscripcion, nombreCurso, onCancelar }) {
  const handleCancelar = () => {
    // Pedimos confirmación porque la cancelación es irreversible en este sistema.
    const confirmar = window.confirm(
      `¿Cancelar la inscripción de ${inscripcion.nombre} ${inscripcion.apellido}?`
    );
    if (confirmar) {
      onCancelar(inscripcion.id);
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-100">
      <td className="py-3 px-4 text-sm text-slate-800">
        {inscripcion.apellido}, {inscripcion.nombre}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600 font-mono">
        {inscripcion.dni}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">
        {inscripcion.email}
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">
        <div className="flex flex-col gap-1">
          <span>{nombreCurso}</span>
          {inscripcion.licenciaArchivo && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-700
              bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5 w-fit">
              📎 {inscripcion.licenciaArchivo}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-slate-400">
        {inscripcion.fechaInscripcion}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={handleCancelar}
          className="text-xs font-medium text-red-600 hover:text-red-800
            hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors duration-150"
        >
          Cancelar
        </button>
      </td>
    </tr>
  );
}

export default InscriptoRow;
