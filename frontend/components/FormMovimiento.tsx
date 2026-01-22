// Formulario de movimiento: Usa categorías y medios de pago
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { listCategorias } from '../lib/api-unified/categorias';
import { listMedios } from '../lib/api-unified/medios';
import { listOpcionesEnriquecidas, type OpcionEnriquecida } from '../lib/api-unified/opciones';
import { createMovimiento, updateMovimiento, getMovimiento } from '../lib/api-unified/movimientos';
import { useFocusRules } from '../hooks/useFocusRules';
import { useSessionMock } from '../hooks/useSessionMock';
import Toast from './Toast';

type Categoria = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
  es_plan: boolean;
  activo: boolean;
};

type MedioPago = {
  id: string;
  nombre: string;
  activo: boolean;
  orden: number;
};

type Props = {
  mode: 'create' | 'edit';
  movimientoId?: string;
  embedded?: boolean;
  onSuccess?: () => void;
};

export default function FormMovimiento({ mode, movimientoId, embedded = false, onSuccess }: Props) {
  const router = useRouter();
  const { user } = useSessionMock();
  
  // Datos maestros
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [medios, setMedios] = useState<MedioPago[]>([]);
  const [opciones, setOpciones] = useState<OpcionEnriquecida[]>([]);
  
  // Estado del dropdown de carga rápida (no se persiste, solo precarga)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>('');
  
  // Estado del formulario
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [nota, setNota] = useState<string>('');
  
  // UI state
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ 
    fecha?: string; 
    monto?: string; 
    medio_pago?: string; 
    nombre_cliente?: string; 
    nota?: string 
  }>({});
  
  // Estado para confirmación de duplicados
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  
  // Flag para evitar sobrescribir valores iniciales múltiples veces
  const [initialOpcionApplied, setInitialOpcionApplied] = useState(false);

  // Cargar datos maestros
  useEffect(() => {
    listCategorias(true).then((cats: Categoria[]) => {
      setCategorias(cats);
      // Solo pre-seleccionar primera categoría si no hay una ya seleccionada
      if (cats.length > 0 && !categoriaId) {
        setCategoriaId(cats[0].id);
      }
    });
    
    listMedios(true).then((m: MedioPago[]) => {
      setMedios(m);
      // Solo pre-seleccionar primer medio si no hay uno ya seleccionado
      if (m.length > 0 && !medioId) {
        setMedioId(m[0].id);
      }
    });
    
    // Cargar opciones para carga rápida
    listOpcionesEnriquecidas(true).then((opts: OpcionEnriquecida[]) => {
      setOpciones(opts);
    });
  }, []);

  // Aplicar opción inicial desde query string (integración con botonera mobile)
  useEffect(() => {
    if (initialOpcionApplied || mode === 'edit') return;
    
    const opcionFromQuery = typeof router.query.opcion === 'string' ? router.query.opcion : null;
    
    if (opcionFromQuery && opciones.length > 0) {
      const opcion = opciones.find(o => o.id === opcionFromQuery);
      if (opcion) {
        setOpcionSeleccionada(opcionFromQuery);
        aplicarOpcion(opcion);
        setInitialOpcionApplied(true);
      }
    }
  }, [router.query.opcion, opciones, mode, initialOpcionApplied]);

  // Si edición, precargar movimiento
  useEffect(() => {
    if (mode === 'edit' && movimientoId) {
      getMovimiento(movimientoId).then((mov: any) => {
        if (!mov) return;
        setCategoriaId(mov.categoria_movimiento_id);
        setMedioId(mov.medio_pago_id);
        setMonto(mov.monto);
        setFecha(mov.fecha);
        setNombreCliente(mov.nombre_cliente ?? '');
        setNota(mov.nota ?? '');
      });
    }
  }, [mode, movimientoId]);

  // Categoría actual seleccionada
  const categoriaActual = useMemo(
    () => categorias.find((c) => c.id === categoriaId),
    [categorias, categoriaId]
  );

  // Focus rules - si hay monto sugerido, foco en guardar; si no, en monto
  const tieneMonto = monto !== '';
  const focusRule = useFocusRules(tieneMonto);

  // Función para aplicar los valores de una opción
  const aplicarOpcion = (opcion: OpcionEnriquecida) => {
    setCategoriaId(opcion.categoria_id);
    setMedioId(opcion.medio_pago_id);
    if (opcion.monto_sugerido !== null) {
      setMonto(opcion.monto_sugerido);
    }
  };

  // Handler cuando se selecciona una opción del dropdown
  const handleOpcionChange = (opcionId: string) => {
    setOpcionSeleccionada(opcionId);
    
    if (!opcionId) return; // Si se deselecciona, no hacer nada
    
    const opcion = opciones.find(o => o.id === opcionId);
    if (opcion) {
      aplicarOpcion(opcion);
    }
  };

  const buildPayload = (confirmarDuplicado = false) => ({
    fecha,
    categoria_movimiento_id: categoriaId!,
    medio_pago_id: medioId!,
    monto: Number(monto),
    nombre_cliente: categoriaActual?.es_plan ? nombreCliente || null : null,
    nota: nota || null,
    confirmar_duplicado: confirmarDuplicado,
  });

  const handleSuccess = () => {
    setToast('Movimiento registrado ✔');
    setLoading(false);
    
    if (embedded && onSuccess) {
      // Reset form for embedded mode
      setMonto('');
      setNombreCliente('');
      setNota('');
      setOpcionSeleccionada('');
      onSuccess();
      setTimeout(() => setToast(''), 2000);
    } else {
      setTimeout(() => router.push('/home'), 600);
    }
  };

  const onGuardar = async (confirmarDuplicado = false) => {
    const nextErrors: typeof errors = {};
    if (!fecha) nextErrors.fecha = 'La fecha es obligatoria.';
    if (monto === '') nextErrors.monto = 'El monto es obligatorio.';
    if (!medioId) nextErrors.medio_pago = 'El medio de pago es obligatorio.';
    if (categoriaActual?.es_plan && nombreCliente === '') {
      nextErrors.nombre_cliente = 'El nombre de cliente es obligatorio.';
    }
    // Nota obligatoria para egresos
    if (categoriaActual?.sentido === 'egreso' && !nota.trim()) {
      nextErrors.nota = 'La nota es obligatoria para egresos.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !categoriaActual || !categoriaId) return;
    
    setLoading(true);
    const payload = buildPayload(confirmarDuplicado);

    if (mode === 'edit') {
      await updateMovimiento(movimientoId!, payload);
      handleSuccess();
      return;
    }

    // Modo create: verificar duplicados
    const result = await createMovimiento(payload);
    
    if (result.requires_confirmation && !result.created) {
      // Hay un posible duplicado, mostrar advertencia
      setLoading(false);
      setPendingPayload(payload);
      setShowDuplicateWarning(true);
      return;
    }

    // Movimiento creado exitosamente
    handleSuccess();
  };

  const handleConfirmDuplicate = async () => {
    setShowDuplicateWarning(false);
    setPendingPayload(null);
    // Volver a intentar con confirmación
    await onGuardar(true);
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateWarning(false);
    setPendingPayload(null);
    setLoading(false);
  };

  return (
    <>
      {/* Header con banner - solo si no está embebido */}
      {!embedded && (
        <>
          <header className="form-header">
            <h1 className="title-primary">
              {mode === 'create' ? 'Nuevo Movimiento' : 'Editar Movimiento'}
            </h1>
          </header>
          <div className="page-divider" />
        </>
      )}
      
      {/* Título para modo embebido */}
      {embedded && (
        <h2 className="form-embedded-title">Nuevo Movimiento</h2>
      )}
      
      {/* Formulario */}
      <main className={embedded ? "form-main-embedded" : "form-main"}>
        <div className="form-fields">
          {/* Dropdown de carga rápida (solo en modo create) */}
          {mode === 'create' && opciones.length > 0 && (
            <div>
              <label className="form-label">
                Carga rápida
              </label>
              <select
                value={opcionSeleccionada}
                onChange={(e) => handleOpcionChange(e.target.value)}
                className="form-select"
              >
                <option value="">— Seleccionar opción —</option>
                {opciones.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nombre_display} ({o.categoria_sentido})
                  </option>
                ))}
              </select>
              <span className="form-hint">Selecciona para precargar categoría, medio y monto</span>
            </div>
          )}

          {/* Selector de Categoría */}
          <div>
            <label className="form-label">
              Categoría<span className="form-label-required">*</span>
            </label>
            <select
              value={categoriaId ?? ''}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="form-select"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.sentido})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="form-label">
              Fecha<span className="form-label-required">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => {
                setFecha(e.target.value);
                setErrors((prev) => ({ ...prev, fecha: undefined }));
              }}
              className="form-input"
            />
            {errors.fecha && <span className="form-error">{errors.fecha}</span>}
          </div>

          {/* Monto */}
          <div>
            <label className="form-label">
              Monto<span className="form-label-required">*</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value === '' ? '' : Number(e.target.value));
                setErrors((prev) => ({ ...prev, monto: undefined }));
              }}
              className="form-input"
              placeholder="Ingrese el monto"
              autoFocus={focusRule.initialTarget === 'monto'}
            />
            {errors.monto && <span className="form-error">{errors.monto}</span>}
          </div>

          {/* Medio de pago */}
          <div>
            <label className="form-label">
              Medio de pago<span className="form-label-required">*</span>
            </label>
            <select
              value={medioId ?? ''}
              onChange={(e) => {
                setMedioId(e.target.value);
                setErrors((prev) => ({ ...prev, medio_pago: undefined }));
              }}
              className="form-select"
            >
              {medios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {errors.medio_pago && <span className="form-error">{errors.medio_pago}</span>}
          </div>

          {/* Nombre del cliente (solo si es plan) */}
          {categoriaActual?.es_plan && (
            <div>
              <label className="form-label">
                Nombre del cliente<span className="form-label-required">*</span>
              </label>
              <input
                value={nombreCliente}
                onChange={(e) => {
                  setNombreCliente(e.target.value);
                  setErrors((prev) => ({ ...prev, nombre_cliente: undefined }));
                }}
                className="form-input"
                placeholder="Nombre y apellido del cliente"
              />
              {errors.nombre_cliente && <span className="form-error">{errors.nombre_cliente}</span>}
            </div>
          )}

          {/* Nota */}
          <div>
            <label className="form-label">
              Nota{categoriaActual?.sentido === 'egreso' && <span className="form-label-required">*</span>}
            </label>
            <input
              value={nota}
              onChange={(e) => {
                setNota(e.target.value);
                setErrors((prev) => ({ ...prev, nota: undefined }));
              }}
              className="form-input"
              placeholder={categoriaActual?.sentido === 'egreso' ? 'Descripción del egreso (obligatorio)' : 'Observaciones adicionales'}
            />
            {errors.nota && <span className="form-error">{errors.nota}</span>}
          </div>
        </div>
      </main>

      {/* Botón Guardar */}
      <div className={embedded ? "form-actions-embedded" : "form-actions"}>
        <button
          type="button"
          onClick={() => onGuardar()}
          disabled={loading}
          className="form-btn-submit"
          autoFocus={focusRule.initialTarget === 'guardar'}
        >
          Guardar
        </button>
      </div>

      {toast && <Toast message={toast} />}

      {/* Modal de advertencia de duplicado */}
      {showDuplicateWarning && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-warning">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <h3 className="modal-title">Posible movimiento duplicado</h3>
            <p className="modal-message">
              Ya existe un movimiento con la misma categoría, monto, fecha y cliente.
              <br />
              ¿Deseas registrarlo de todas formas?
            </p>
            <div className="modal-actions">
              <button 
                onClick={handleCancelDuplicate} 
                className="modal-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDuplicate} 
                className="modal-btn-primary"
              >
                Sí, registrar igualmente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
