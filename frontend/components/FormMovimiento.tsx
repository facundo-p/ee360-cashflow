// Formulario de movimiento: estilo espartano con dropdown de tipo.
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { listTipos } from '../lib/api-mock/tipos';
import { listMedios } from '../lib/api-mock/medios';
import { createMovimiento, updateMovimiento, getMovimiento } from '../lib/api-mock/movimientos';
import { useFocusRules } from '../hooks/useFocusRules';
import { useSessionMock } from '../hooks/useSessionMock';
import Toast from './Toast';

const DEFAULT_ICON = '/icons/default.png';

type Props = {
  mode: 'create' | 'edit';
  movimientoId?: string;
  embedded?: boolean;
  onSuccess?: () => void;
};

export default function FormMovimiento({ mode, movimientoId, embedded = false, onSuccess }: Props) {
  const router = useRouter();
  const { user } = useSessionMock();
  const [tipos, setTipos] = useState<any[]>([]);
  const [medios, setMedios] = useState<any[]>([]);
  const [tipoId, setTipoId] = useState<string | null>(null);
  const [medioId, setMedioId] = useState<string | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [nota, setNota] = useState<string>('');
  const [toast, setToast] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ fecha?: string; monto?: string; medio_pago?: string; nombre_cliente?: string }>({});

  // Cargar datos
  useEffect(() => {
    listTipos().then((t) => {
      setTipos(t);
      const fromQuery = typeof router.query.tipo === 'string' ? router.query.tipo : null;
      const chosen = fromQuery && t.find((x: any) => x.id === fromQuery) ? fromQuery : t[0]?.id ?? null;
      setTipoId(chosen);
    });
    listMedios().then(setMedios);
  }, [router.query.tipo]);

  // Si edición, precargar movimiento
  useEffect(() => {
    if (mode === 'edit' && movimientoId) {
      getMovimiento(movimientoId).then((mov: any) => {
        if (!mov) return;
        setTipoId(mov.tipo_movimiento_id);
        setMedioId(mov.medio_pago_id);
        setMonto(mov.monto);
        setFecha(mov.fecha);
        setNombreCliente(mov.nombre_cliente ?? '');
        setNota(mov.nota ?? '');
      });
    }
  }, [mode, movimientoId]);

  const tipoActual = useMemo(() => tipos.find((t) => t.id === tipoId), [tipos, tipoId]);

  useEffect(() => {
    if (tipoActual) {
      if (tipoActual.monto_sugerido != null && mode === 'create') {
        setMonto(tipoActual.monto_sugerido);
      } else if (mode === 'create' && tipoActual.monto_sugerido == null) {
        setMonto('');
      }
      if (mode === 'create') {
        setMedioId(tipoActual.medio_pago_id ?? medios[0]?.id ?? null);
      }
    }
  }, [tipoActual, medios, mode]);

  const focusRule = useFocusRules(tipoActual?.monto_sugerido != null);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = DEFAULT_ICON;
  };

  const onGuardar = async () => {
    const nextErrors: typeof errors = {};
    if (!fecha) nextErrors.fecha = 'La fecha es obligatoria.';
    if (monto === '') nextErrors.monto = 'El monto es obligatorio.';
    if (!medioId) nextErrors.medio_pago = 'El medio de pago es obligatorio.';
    if (tipoActual.es_plan  && nombreCliente === '') nextErrors.nombre_cliente = 'El nombre de cliente es obligatorio.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !tipoActual) return;
    setLoading(true);
    const basePayload = {
      fecha,
      tipo_movimiento_id: tipoActual.id,
      sentido: tipoActual.sentido,
      monto: Number(monto),
      medio_pago_id: medioId,
      nombre_cliente: tipoActual.es_plan ? nombreCliente || null : null,
      nota: nota || null,
      usuario_creador_id: user?.id ?? 'u-user',
    };
    const mov =
      mode === 'create'
        ? await createMovimiento(basePayload)
        : await updateMovimiento(movimientoId!, basePayload);
    setToast('Movimiento registrado ✔');
    setLoading(false);
    
    if (embedded && onSuccess) {
      // Reset form for embedded mode
      setMonto(tipoActual?.monto_sugerido ?? '');
      setNombreCliente('');
      setNota('');
      onSuccess();
      setTimeout(() => setToast(''), 2000);
    } else {
      setTimeout(() => router.push('/home'), 600);
    }
    return mov;
  };

  const iconSrc = tipoActual?.icono ? `/icons/${tipoActual.icono}` : DEFAULT_ICON;

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
        {/* Icon preview */}
        <div className="quick-form-icon-container">
          <div className="quick-form-icon-wrapper">
            <img 
              src={iconSrc} 
              alt="" 
              onError={handleImageError}
              className="quick-form-icon"
            />
          </div>
        </div>
        <div className="form-fields">
          {/* Selector de Tipo */}
          <div>
            <label className="form-label">
              Tipo de movimiento<span className="form-label-required">*</span>
            </label>
            <select
              value={tipoId ?? ''}
              onChange={(e) => setTipoId(e.target.value)}
              className="form-select"
            >
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({t.sentido})
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

          {/* Nombre del cliente */}
          <div>
            <label className="form-label">
              Nombre del cliente<span className="form-label-required">*</span>
              </label>
            <input
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="form-input"
              placeholder=""
            />
            {errors.nombre_cliente && <span className="form-error">{errors.nombre_cliente}</span>}
          </div>

          {/* Nota */}
          <div>
            <label className="form-label">Nota</label>
            <input
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="form-input"
              placeholder=""
            />
          </div>
        </div>
      </main>

      {/* Botón Guardar */}
      <div className={embedded ? "form-actions-embedded" : "form-actions"}>
        <button
          type="button"
          onClick={onGuardar}
          disabled={loading}
          className="form-btn-submit"
          autoFocus={focusRule.initialTarget === 'guardar'}
        >
          Guardar
        </button>
      </div>

      {toast && <Toast message={toast} />}
    </>
  );
}


