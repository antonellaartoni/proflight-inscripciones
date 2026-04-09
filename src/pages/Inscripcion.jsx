import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const CURSO_PILOTO_PRIVADO_ID   = 1;
const CURSO_PILOTO_COMERCIAL_ID = 2;
const CURSO_INSTRUMENTO_ID      = 3;
const CURSO_HELICOPTERO_ID      = 4;

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

  // Piloto Privado
  const [secundarioCompleto, setSecundarioCompleto] = useState(null);
  const [docDniFile, setDocDniFile] = useState(null);
  const [docSecundarioFile, setDocSecundarioFile] = useState(null);
  const [docDniPreviewUrl, setDocDniPreviewUrl] = useState(null);
  const [docSecundarioPreviewUrl, setDocSecundarioPreviewUrl] = useState(null);

  // Piloto Comercial
  const [licenciaFile, setLicenciaFile] = useState(null);
  const [licenciaPreviewUrl, setLicenciaPreviewUrl] = useState(null);

  // Instrumento y Navegación
  const [licenciaComercialFile, setLicenciaComercialFile] = useState(null);
  const [licenciaComercialPreviewUrl, setLicenciaComercialPreviewUrl] = useState(null);

  // Piloto de Helicóptero
  const [licenciaHelicopteroFile, setLicenciaHelicopteroFile] = useState(null);
  const [licenciaHelicopteroPreviewUrl, setLicenciaHelicopteroPreviewUrl] = useState(null);

  const cursoIdNum = parseInt(form.cursoId);
  const requiereDocPrivado     = cursoIdNum === CURSO_PILOTO_PRIVADO_ID;
  const requiereDocComercial   = cursoIdNum === CURSO_PILOTO_COMERCIAL_ID;
  const requiereDocInstrumento = cursoIdNum === CURSO_INSTRUMENTO_ID;
  const requiereDocHelicoptero = cursoIdNum === CURSO_HELICOPTERO_ID;

  // Un useEffect por archivo para gestionar la URL de preview y su limpieza.
  useEffect(() => {
    if (!docDniFile) { setDocDniPreviewUrl(null); return; }
    const url = URL.createObjectURL(docDniFile);
    setDocDniPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [docDniFile]);

  useEffect(() => {
    if (!docSecundarioFile) { setDocSecundarioPreviewUrl(null); return; }
    const url = URL.createObjectURL(docSecundarioFile);
    setDocSecundarioPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [docSecundarioFile]);

  useEffect(() => {
    if (!licenciaFile) { setLicenciaPreviewUrl(null); return; }
    const url = URL.createObjectURL(licenciaFile);
    setLicenciaPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [licenciaFile]);

  useEffect(() => {
    if (!licenciaComercialFile) { setLicenciaComercialPreviewUrl(null); return; }
    const url = URL.createObjectURL(licenciaComercialFile);
    setLicenciaComercialPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [licenciaComercialFile]);

  useEffect(() => {
    if (!licenciaHelicopteroFile) { setLicenciaHelicopteroPreviewUrl(null); return; }
    const url = URL.createObjectURL(licenciaHelicopteroFile);
    setLicenciaHelicopteroPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [licenciaHelicopteroFile]);

  // Al cambiar de curso limpiamos toda la documentación para no dejar estado fantasma.
  useEffect(() => {
    setSecundarioCompleto(null);
    setDocDniFile(null);
    setDocSecundarioFile(null);
    setLicenciaFile(null);
    setLicenciaComercialFile(null);
    setLicenciaHelicopteroFile(null);
  }, [form.cursoId]);

  // Al cambiar la respuesta sobre el secundario, limpiamos el documento correspondiente
  // porque puede haber quedado un archivo del caso anterior (analítico vs. certificado).
  useEffect(() => {
    setDocSecundarioFile(null);
  }, [secundarioCompleto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const makeFileHandler = (setter, errorKey) => (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setter(archivo);
    if (errores[errorKey]) setErrores((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const validarArchivo = (archivo) => {
    if (!archivo) return "El documento es obligatorio.";
    if (!TIPOS_ACEPTADOS.includes(archivo.type)) return "El archivo debe ser PDF, JPG o JPEG.";
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) return `El archivo no puede superar los ${TAMANO_MAXIMO_MB} MB.`;
    return null;
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!form.cursoId) {
      nuevosErrores.cursoId = "Seleccioná un curso.";
    } else {
      if (getCuposDisponibles(cursoIdNum) === 0) nuevosErrores.cursoId = "Este curso no tiene cupos disponibles.";
      if (isDniDuplicado(cursoIdNum, form.dni)) nuevosErrores.dni = "Este DNI ya está inscripto en este curso.";
    }

    if (!form.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!form.apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!form.dni.trim()) nuevosErrores.dni = nuevosErrores.dni || "El DNI es obligatorio.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!emailRegex.test(form.email)) {
      nuevosErrores.email = "El formato del email no es válido.";
    }

    if (requiereDocPrivado) {
      if (secundarioCompleto === null) nuevosErrores.secundario = "Indicá si completaste el nivel secundario.";
      const e1 = validarArchivo(docDniFile);       if (e1) nuevosErrores.docDni = e1;
      const e2 = validarArchivo(docSecundarioFile); if (e2) nuevosErrores.docSecundario = e2;
    }
    if (requiereDocComercial)   { const e = validarArchivo(licenciaFile);          if (e) nuevosErrores.licencia = e; }
    if (requiereDocInstrumento) { const e = validarArchivo(licenciaComercialFile); if (e) nuevosErrores.licenciaComercial = e; }
    if (requiereDocHelicoptero) { const e = validarArchivo(licenciaHelicopteroFile); if (e) nuevosErrores.licenciaHelicoptero = e; }

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
        cursoId: cursoIdNum,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.dni.trim(),
        email: form.email.trim(),
        secundarioCompleto:   requiereDocPrivado      ? secundarioCompleto             : null,
        docDni:               docDniFile              ? docDniFile.name                : null,
        docSecundario:        docSecundarioFile       ? docSecundarioFile.name         : null,
        licenciaArchivo:      licenciaFile            ? licenciaFile.name              : null,
        licenciaComercial:    licenciaComercialFile   ? licenciaComercialFile.name     : null,
        licenciaHelicoptero:  licenciaHelicopteroFile ? licenciaHelicopteroFile.name   : null,
      },
    });

    setResultado("exito");
    setTimeout(() => navigate("/inscriptos"), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white">Formulario de inscripción</h1>
        <p className="text-white/40 text-sm">
          Completá tus datos para reservar tu lugar en el curso.
        </p>
      </div>

      {resultado === "exito" && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30
            flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-400 text-xs font-bold">✓</span>
          </div>
          <div>
            <p className="font-semibold text-emerald-400">Inscripción confirmada</p>
            <p className="text-emerald-400/60 text-sm">Redirigiendo a la lista de inscriptos...</p>
          </div>
        </div>
      )}

      <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Selector de curso */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/60">
              Curso <span className="text-gold-500">*</span>
            </label>
            <select
              name="cursoId"
              value={form.cursoId}
              onChange={handleChange}
              className={`
                w-full px-3 py-2.5 rounded-xl border bg-white/[0.06] text-white
                text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/40
                focus:border-gold-500/40 transition
                ${errores.cursoId ? "border-red-500/40" : "border-white/10"}
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
            {errores.cursoId && <p className="text-xs text-red-400">{errores.cursoId}</p>}
          </div>

          {/* ── Piloto Privado ── */}
          {requiereDocPrivado && (
            <SeccionRequisito titulo="Documentación requerida — Piloto Privado">
              <p className="text-xs text-white/40 -mt-1">
                Para inscribirte necesitás presentar tu DNI y documentación del nivel secundario.
              </p>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-white/60">
                  ¿Completaste el nivel secundario? <span className="text-gold-500">*</span>
                </p>
                <div className="flex gap-2">
                  {[{ valor: true, label: "Sí" }, { valor: false, label: "No" }].map(({ valor, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setSecundarioCompleto(valor);
                        if (errores.secundario) setErrores((prev) => ({ ...prev, secundario: "" }));
                      }}
                      className={`
                        px-5 py-2 rounded-xl text-sm font-medium border transition-all duration-150
                        ${secundarioCompleto === valor
                          ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
                          : "bg-white/[0.04] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60"
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {errores.secundario && <p className="text-xs text-red-400">{errores.secundario}</p>}
              </div>

              {secundarioCompleto !== null && (
                <div className="flex flex-col gap-3">
                  <FileInput
                    label="DNI (frente)"
                    onChange={makeFileHandler(setDocDniFile, "docDni")}
                    archivo={docDniFile}
                    previewUrl={docDniPreviewUrl}
                    error={errores.docDni}
                    tamanoMaxMB={TAMANO_MAXIMO_MB}
                  />
                  <FileInput
                    label={secundarioCompleto ? "Analítico del Secundario" : "Certificado de Alumno Regular"}
                    onChange={makeFileHandler(setDocSecundarioFile, "docSecundario")}
                    archivo={docSecundarioFile}
                    previewUrl={docSecundarioPreviewUrl}
                    error={errores.docSecundario}
                    tamanoMaxMB={TAMANO_MAXIMO_MB}
                    nota={secundarioCompleto
                      ? "Título o constancia de egreso."
                      : "Emitido por tu institución educativa, con el ciclo lectivo en curso."
                    }
                  />
                </div>
              )}
            </SeccionRequisito>
          )}

          {/* ── Piloto Comercial ── */}
          {requiereDocComercial && (
            <SeccionRequisito titulo="Requisito previo: Licencia de Piloto Privado">
              <p className="text-xs text-white/40 -mt-1">
                En Argentina, el acceso al curso de Piloto Comercial requiere una Licencia de Piloto
                Privado vigente (RAA 61.113).
              </p>
              <FileInput
                label="Licencia de Piloto Privado"
                onChange={makeFileHandler(setLicenciaFile, "licencia")}
                archivo={licenciaFile}
                previewUrl={licenciaPreviewUrl}
                error={errores.licencia}
                tamanoMaxMB={TAMANO_MAXIMO_MB}
              />
            </SeccionRequisito>
          )}

          {/* ── Instrumento y Navegación ── */}
          {requiereDocInstrumento && (
            <SeccionRequisito titulo="Requisito previo: Licencia de Piloto Comercial">
              <p className="text-xs text-white/40 -mt-1">
                La habilitación IFR (vuelo por instrumentos) requiere una Licencia de Piloto
                Comercial vigente (RAA 61.65).
              </p>
              <FileInput
                label="Licencia de Piloto Comercial"
                onChange={makeFileHandler(setLicenciaComercialFile, "licenciaComercial")}
                archivo={licenciaComercialFile}
                previewUrl={licenciaComercialPreviewUrl}
                error={errores.licenciaComercial}
                tamanoMaxMB={TAMANO_MAXIMO_MB}
              />
            </SeccionRequisito>
          )}

          {/* ── Piloto de Helicóptero ── */}
          {requiereDocHelicoptero && (
            <SeccionRequisito titulo="Requisito previo: Licencia de Piloto Privado de Helicóptero">
              <p className="text-xs text-white/40 -mt-1">
                Se requiere una Licencia de Piloto Privado de Helicóptero (LPPH) vigente,
                conforme a la Subparte H del RAA Part 61.
              </p>
              <FileInput
                label="Licencia de Piloto Privado de Helicóptero (LPPH)"
                onChange={makeFileHandler(setLicenciaHelicopteroFile, "licenciaHelicoptero")}
                archivo={licenciaHelicopteroFile}
                previewUrl={licenciaHelicopteroPreviewUrl}
                error={errores.licenciaHelicoptero}
                tamanoMaxMB={TAMANO_MAXIMO_MB}
              />
            </SeccionRequisito>
          )}

          {/* Campos personales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errores.nombre} placeholder="Ej: María" />
            <CampoTexto label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} error={errores.apellido} placeholder="Ej: González" />
          </div>
          <CampoTexto label="DNI" name="dni" value={form.dni} onChange={handleChange} error={errores.dni} placeholder="Ej: 38492011" />
          <CampoTexto label="Email" name="email" value={form.email} onChange={handleChange} error={errores.email} placeholder="Ej: maria@email.com" type="email" />

          <button
            type="submit"
            disabled={resultado === "exito"}
            className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/30
              text-black disabled:text-black/40 font-semibold rounded-xl
              transition-colors duration-150 mt-2"
          >
            Confirmar inscripción
          </button>

        </form>
      </div>
    </div>
  );
}

// Sección de requisito previo con borde izquierdo dorado.
// Reemplaza los paneles de fondo coloreado por algo más sutil y profesional.
function SeccionRequisito({ titulo, children }) {
  return (
    <div className="flex flex-col gap-3 border-l-2 border-gold-500/40 pl-4">
      <p className="text-sm font-semibold text-gold-400">{titulo}</p>
      {children}
    </div>
  );
}

function FileInput({ label, onChange, archivo, previewUrl, error, tamanoMaxMB, nota }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/60">
        {label} <span className="text-gold-500">*</span>
      </label>
      <label className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer text-sm transition
        ${error
          ? "border-red-500/40 bg-red-500/5"
          : archivo
          ? "border-gold-500/30 bg-gold-500/5"
          : "border-white/10 bg-white/[0.04] hover:border-white/20"
        }
      `}>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${archivo ? "text-gold-400 border-gold-500/30 bg-gold-500/10" : "text-white/30 border-white/10 bg-white/[0.04]"}`}>
          {archivo ? "Cargado" : "Adjuntar"}
        </span>
        <span className={archivo ? "text-white/70 text-xs truncate" : "text-white/30 text-xs"}>
          {archivo ? archivo.name : `PDF, JPG o JPEG — máx. ${tamanoMaxMB} MB`}
        </span>
        <input type="file" accept=".pdf,.jpg,.jpeg" onChange={onChange} className="hidden" />
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {nota && !error && <p className="text-xs text-white/30">{nota}</p>}

      {archivo && previewUrl && (
        archivo.type.startsWith("image/") ? (
          <img src={previewUrl} alt={`Preview ${label}`}
            className="rounded-lg border border-white/10 max-h-40 object-contain bg-white/[0.03]" />
        ) : (
          <div className="flex items-center gap-3 bg-white/[0.04] rounded-lg border border-white/[0.08] px-4 py-3">
            <div className="w-8 h-8 rounded-md bg-gold-500/10 border border-gold-500/20
              flex items-center justify-center flex-shrink-0">
              <span className="text-gold-400 text-xs font-bold">PDF</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/70 truncate">{archivo.name}</p>
              <p className="text-xs text-white/30">{(archivo.size / 1024).toFixed(0)} KB</p>
            </div>
            <span className="ml-auto text-gold-400 text-xs font-medium flex-shrink-0">✓</span>
          </div>
        )
      )}
    </div>
  );
}

function CampoTexto({ label, name, value, onChange, error, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/60">
        {label} <span className="text-gold-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2.5 rounded-xl border text-white placeholder-white/20
          text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/40
          focus:border-gold-500/40 transition bg-white/[0.06]
          ${error ? "border-red-500/40" : "border-white/10"}
        `}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default Inscripcion;
