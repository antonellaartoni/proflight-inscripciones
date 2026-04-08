import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

// ID del curso que requiere licencia previa como prerequisito.
// Lo definimos como constante acá para que sea fácil de encontrar
// y modificar si en el futuro se agregan más cursos con requisitos.
const CURSO_PILOTO_COMERCIAL_ID = 2;

// Tipos de archivo aceptados para la licencia.
const TIPOS_ACEPTADOS = ["application/pdf", "image/jpeg", "image/jpg"];
const TAMANO_MAXIMO_MB = 3;

function Inscripcion() {
  const { state, dispatch, getCuposDisponibles, isDniDuplicado } = useApp();

  const [searchParams] = useSearchParams();
  const cursoIdParam = searchParams.get("cursoId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cursoId: cursoIdParam || "",
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
  });

  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);

  // Estado para el archivo de licencia. Guardamos el File object
  // para poder hacer la preview, pero solo enviamos el nombre al reducer.
  const [licenciaFile, setLicenciaFile] = useState(null);

  // URL temporal generada en memoria para la preview del archivo.
  // Se crea con createObjectURL y se revoca cuando ya no se necesita.
  const [licenciaPreviewUrl, setLicenciaPreviewUrl] = useState(null);

  // Determina si el curso seleccionado requiere licencia previa.
  const requiereLicencia = parseInt(form.cursoId) === CURSO_PILOTO_COMERCIAL_ID;

  // Cada vez que cambia el archivo seleccionado, generamos una nueva
  // URL de preview. Cuando el componente se desmonta o el archivo cambia,
  // revocamos la URL anterior para liberar memoria del navegador.
  useEffect(() => {
    if (!licenciaFile) {
      setLicenciaPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(licenciaFile);
    setLicenciaPreviewUrl(url);

    // Función de limpieza: se ejecuta antes del próximo efecto o al desmontar.
    return () => URL.revokeObjectURL(url);
  }, [licenciaFile]);

  // Si el usuario cambia a un curso que no requiere licencia,
  // limpiamos el archivo para no dejarlo en estado "fantasma".
  useEffect(() => {
    if (!requiereLicencia) {
      setLicenciaFile(null);
    }
  }, [requiereLicencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLicenciaChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setLicenciaFile(archivo);
    // Limpiamos el error del campo si existía.
    if (errores.licencia) {
      setErrores((prev) => ({ ...prev, licencia: "" }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    const cursoIdNum = parseInt(form.cursoId);

    if (!form.cursoId) {
      nuevosErrores.cursoId = "Seleccioná un curso.";
    } else {
      if (getCuposDisponibles(cursoIdNum) === 0) {
        nuevosErrores.cursoId = "Este curso no tiene cupos disponibles.";
      }
      if (isDniDuplicado(cursoIdNum, form.dni)) {
        nuevosErrores.dni = "Este DNI ya está inscripto en este curso.";
      }
    }

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!form.dni.trim()) {
      nuevosErrores.dni = nuevosErrores.dni || "El DNI es obligatorio.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!emailRegex.test(form.email)) {
      nuevosErrores.email = "El formato del email no es válido.";
    }

    // Validaciones del archivo de licencia, solo si el curso lo requiere.
    if (requiereLicencia) {
      if (!licenciaFile) {
        nuevosErrores.licencia = "Adjuntá tu licencia de Piloto Privado para continuar.";
      } else if (!TIPOS_ACEPTADOS.includes(licenciaFile.type)) {
        nuevosErrores.licencia = "El archivo debe ser PDF, JPG o JPEG.";
      } else if (licenciaFile.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
        nuevosErrores.licencia = `El archivo no puede superar los ${TAMANO_MAXIMO_MB} MB.`;
      }
    }

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresEncontrados = validar();

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados);
      return;
    }

    dispatch({
      type: "INSCRIBIR",
      payload: {
        cursoId: parseInt(form.cursoId),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        email: form.email.trim(),
        // Solo enviamos el nombre del archivo, no el contenido binario.
        // El archivo en sí vive en memoria local y no se persiste.
        licenciaArchivo: licenciaFile ? licenciaFile.name : null,
      },
    });

    setResultado("exito");
    setTimeout(() => navigate("/inscriptos"), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800">Formulario de inscripción</h1>
        <p className="text-slate-500 text-sm">
          Completá tus datos para reservar tu lugar en el curso.
        </p>
      </div>

      {resultado === "exito" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-emerald-800">¡Inscripción confirmada!</p>
            <p className="text-emerald-600 text-sm">Te estamos redirigiendo a la lista de inscriptos...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* Selector de curso */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Curso <span className="text-red-500">*</span>
          </label>
          <select
            name="cursoId"
            value={form.cursoId}
            onChange={handleChange}
            className={`
              w-full px-3 py-2.5 rounded-xl border bg-white text-slate-800
              text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
              ${errores.cursoId ? "border-red-400" : "border-slate-300"}
            `}
          >
            <option value="">Seleccioná un curso...</option>
            {state.cursos.map((curso) => {
              const cupos = getCuposDisponibles(curso.id);
              return (
                <option key={curso.id} value={curso.id} disabled={cupos === 0}>
                  {curso.nombre} — {cupos === 0 ? "Sin cupos" : `${cupos} cupos disponibles`}
                </option>
              );
            })}
          </select>
          {errores.cursoId && (
            <p className="text-xs text-red-500">{errores.cursoId}</p>
          )}
        </div>

        {/* Sección de licencia — aparece solo para Piloto Comercial */}
        {requiereLicencia && (
          <div className="flex flex-col gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Requisito previo: Licencia de Piloto Privado
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  En Argentina, para acceder al curso de Piloto Comercial es obligatorio
                  contar con una licencia de Piloto Privado vigente (RAA 61.113).
                  Adjuntá una copia para continuar.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Licencia de Piloto Privado <span className="text-red-500">*</span>
              </label>

              {/* Input de archivo estilizado */}
              <label className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer
                text-sm transition bg-white
                ${errores.licencia
                  ? "border-red-400 bg-red-50"
                  : licenciaFile
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-300 hover:border-slate-400"
                }
              `}>
                <span className="text-base">📎</span>
                <span className={licenciaFile ? "text-emerald-700" : "text-slate-400"}>
                  {licenciaFile ? licenciaFile.name : "Seleccioná un archivo..."}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg"
                  onChange={handleLicenciaChange}
                  className="hidden"
                />
              </label>

              {errores.licencia && (
                <p className="text-xs text-red-500">{errores.licencia}</p>
              )}

              <p className="text-xs text-slate-400">
                Formatos aceptados: PDF, JPG, JPEG · Máximo {TAMANO_MAXIMO_MB} MB
              </p>
            </div>

            {/* Preview del archivo seleccionado */}
            {licenciaFile && licenciaPreviewUrl && (
              <div className="flex flex-col gap-2">
                {licenciaFile.type.startsWith("image/") ? (
                  // Preview de imagen
                  <img
                    src={licenciaPreviewUrl}
                    alt="Preview de licencia"
                    className="rounded-lg border border-slate-200 max-h-48 object-contain bg-slate-100"
                  />
                ) : (
                  // Preview de PDF: no se puede renderizar inline sin un iframe,
                  // pero sí podemos confirmar visualmente que se cargó.
                  <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{licenciaFile.name}</p>
                      <p className="text-xs text-slate-400">
                        {(licenciaFile.size / 1024).toFixed(0)} KB · PDF
                      </p>
                    </div>
                    <span className="ml-auto text-emerald-600 text-xs font-medium">✓ Cargado</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoTexto
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errores.nombre}
            placeholder="Ej: María"
          />
          <CampoTexto
            label="Apellido"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            error={errores.apellido}
            placeholder="Ej: González"
          />
        </div>

        <CampoTexto
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          error={errores.dni}
          placeholder="Ej: 38492011"
        />

        <CampoTexto
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errores.email}
          placeholder="Ej: maria@email.com"
          type="email"
        />

        <button
          type="submit"
          disabled={resultado === "exito"}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
            text-white font-semibold rounded-xl transition-colors duration-150 mt-2"
        >
          Confirmar inscripción
        </button>

      </form>
    </div>
  );
}

function CampoTexto({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2.5 rounded-xl border text-slate-800
          text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
          ${error ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default Inscripcion;
