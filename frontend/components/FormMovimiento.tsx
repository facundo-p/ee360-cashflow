// Formulario de movimiento: aplica autofoco/teclado, CTA siempre visible.
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { listTipos } from '../lib/api-mock/tipos';
import { listMedios } from '../lib/api-mock/medios';
import { createMovimiento, updateMovimiento, getMovimiento } from '../lib/api-mock/movimientos';
import { useFocusRules } from '../hooks/useFocusRules';
import { useSessionMock } from '../hooks/useSessionMock';
import Toast from './Toast';

type Props = {
  mode: 'create' | 'edit';
  movimientoId?: string;
};

export default function FormMovimiento({ mode, movimientoId }: Props) {
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
  const [errors, setErrors] = useState<{ fecha?: string; monto?: string; medio_pago?: string }>({});

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

  const onGuardar = async () => {
    const nextErrors: typeof errors = {};
    if (!fecha) nextErrors.fecha = 'La fecha es obligatoria.';
    if (monto === '') nextErrors.monto = 'El monto es obligatorio.';
    if (!medioId) nextErrors.medio_pago = 'El medio de pago es obligatorio.';
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
    setTimeout(() => router.push('/home'), 600);
    return mov;
  };

  return (
    <section className="bg-white border border-border shadow-soft rounded-xl p-4 space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">{mode === 'create' ? 'Nuevo movimiento' : 'Editar movimiento'}</h2>
        {tipoActual && (
          <p className="text-sm text-gray-600">
            Tipo: <strong>{tipoActual.nombre}</strong> ({tipoActual.sentido})
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-gray-800">
          <span className="flex items-center gap-1">
            Fecha <span className="text-red-600">*</span>
          </span>
          <input
            type="date"
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setErrors((prev) => ({ ...prev, fecha: undefined }));
            }}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.fecha && <span className="text-xs text-red-600">{errors.fecha}</span>}
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-800">
          <span className="flex items-center gap-1">
            Monto <span className="text-red-600">*</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value === '' ? '' : Number(e.target.value));
              setErrors((prev) => ({ ...prev, monto: undefined }));
            }}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus={focusRule.initialTarget === 'monto'}
          />
          {errors.monto && <span className="text-xs text-red-600">{errors.monto}</span>}
        </label>

        <label className="grid gap-2 text-sm font-medium text-gray-800">
          <span className="flex items-center gap-1">
            Medio de pago <span className="text-red-600">*</span>
          </span>
          <select
            value={medioId ?? ''}
            onChange={(e) => {
              setMedioId(e.target.value);
              setErrors((prev) => ({ ...prev, medio_pago: undefined }));
            }}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {medios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          {errors.medio_pago && <span className="text-xs text-red-600">{errors.medio_pago}</span>}
        </label>

        {tipoActual?.es_plan && (
          <label className="grid gap-2 text-sm font-medium text-gray-800">
            Nombre del cliente
            <input
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
        )}

        <label className="grid gap-2 text-sm font-medium text-gray-800">
          Nota
          <input
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onGuardar}
          disabled={loading}
          className="w-full rounded-lg bg-primary text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60"
          autoFocus={focusRule.initialTarget === 'guardar'}
        >
          Guardar
        </button>
      </div>

      {toast && <Toast message={toast} />}
    </section>
  );
}


