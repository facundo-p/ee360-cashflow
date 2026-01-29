// Listado de movimientos con layout responsivo, filtros, exportación CSV y eliminación.
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { listMovimientos, deleteMovimiento } from '../lib/api-unified/movimientos';
import { listCategorias } from '../lib/api-unified/categorias';
import { listMedios } from '../lib/api-unified/medios';
import { AppLayout } from '../components/layouts';
import { useIsDesktop } from '../hooks/useMediaQuery';
import DateInputWithPlaceholder from '../components/DateInput';
import AdminOnly from '../components/guards/AdminOnly';

type Categoria = {
  id: string;
  nombre: string;
  sentido: 'ingreso' | 'egreso';
};

type MedioPago = {
  id: string;
  nombre: string;
};

type MovimientoItem = {
  id: string;
  fecha: string;
  monto: number;
  categoria_movimiento_id: string;
  categoria_nombre?: string;
  categoria_sentido?: 'ingreso' | 'egreso';
  sentido?: 'ingreso' | 'egreso';
  medio_pago_id: string;
  medio_pago_nombre?: string;
  nombre_cliente?: string | null;
  nota?: string | null;
  created_by_user_id: string;
  created_by_nombre?: string;
  created_at: string;
  // Permisos incluidos en el listado
  can_edit?: boolean;
  can_delete?: boolean;
};

// Modal de confirmación de eliminación
function DeleteConfirmModal({ 
  movimiento, 
  onConfirm, 
  onCancel,
  isDeleting,
}: { 
  movimiento: MovimientoItem; 
  onConfirm: () => void; 
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="modal-title">Eliminar movimiento</h2>
        <p className="modal-message">
          ¿Estás seguro de que deseas eliminar este movimiento?
          <br />
          <strong>{movimiento.categoria_nombre || 'Movimiento'}</strong> - ${movimiento.monto.toLocaleString()}
          <br />
          <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
            {movimiento.fecha}
          </span>
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-btn-secondary" disabled={isDeleting}>
            Cancelar
          </button>
          <button 
            onClick={onConfirm} 
            className="modal-btn-primary"
            style={{ backgroundColor: '#dc2626' }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Botón de eliminar con ícono de tacho
function DeleteButton({ 
  onClick, 
  disabled,
  title,
}: { 
  onClick: (e: React.MouseEvent) => void; 
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="delete-btn"
      style={{
        padding: '6px',
        borderRadius: '6px',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
      }}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#dc2626" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </button>
  );
}

function MovimientosContent() {
  const isDesktop = useIsDesktop();
  const [movs, setMovs] = useState<MovimientoItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [filtroMedioPago, setFiltroMedioPago] = useState<string>('todos');
  const hoy = new Date().toISOString().slice(0, 10);
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  
  // Estado para eliminación
  const [deleteTarget, setDeleteTarget] = useState<MovimientoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [movsData, categoriasData, mediosData] = await Promise.all([
      listMovimientos(),
      listCategorias(),
      listMedios(),
    ]);
    setMovs(movsData as MovimientoItem[]);
    setCategorias(categoriasData);
    setMediosPago(mediosData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Helper to get sentido from enriched or legacy format
  const getSentido = (m: MovimientoItem) => m.categoria_sentido ?? m.sentido ?? 'ingreso';
  const getCategoriaNombre = (m: MovimientoItem) => m.categoria_nombre ?? 'Movimiento';
  const getMedioNombre = (m: MovimientoItem) => m.medio_pago_nombre ?? m.medio_pago_id ?? '-';

  const visibles = useMemo(() => {
    return movs
      .filter((m) => {
        const categoriaId = m.categoria_movimiento_id;
        const okCategoria = filtroCategoria === 'todos' ? true : categoriaId === filtroCategoria;
        const okMedioPago = filtroMedioPago === 'todos' ? true : m.medio_pago_id === filtroMedioPago;
        const okFechaDesde = !fechaDesde || m.fecha >= fechaDesde;
        const okFechaHasta = !fechaHasta || m.fecha <= fechaHasta;
        return okCategoria && okMedioPago && okFechaDesde && okFechaHasta;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));
  }, [movs, filtroCategoria, filtroMedioPago, fechaDesde, fechaHasta]);

  const handleDeleteClick = (e: React.MouseEvent, m: MovimientoItem) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError(null);
    setDeleteTarget(m);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteMovimiento(deleteTarget.id);
      setDeleteTarget(null);
      // Recargar lista
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar';
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const exportCSV = () => {
    const rows = visibles.map((m) => {
      return {
        fecha: m.fecha,
        sentido: getSentido(m),
        categoria: getCategoriaNombre(m),
        medio_pago: getMedioNombre(m),
        monto: m.monto,
        usuario: m.created_by_nombre ?? m.created_by_user_id ?? '',
        nombre_cliente: m.nombre_cliente ?? '',
        nota: m.nota ?? '',
      };
    });
    const defaultRow = { fecha: '', sentido: '', categoria: '', medio_pago: '', monto: '', usuario: '', nombre_cliente: '', nota: '' };
    const header = Object.keys(rows[0] ?? defaultRow);
    const csv = [header.join(','), ...rows.map((r) => header.map((h) => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimientos_${hoy}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Renderizar item de movimiento con botón de eliminar
  const renderMovimientoItem = (m: MovimientoItem) => {
    const sentido = getSentido(m);
    // Usar can_delete del backend (viene en el listado)
    const canDeleteThis = m.can_delete ?? false;
    
    return (
      <div key={m.id} className="list-item" style={{ display: 'flex', alignItems: 'stretch' }}>
        <Link href={`/movimiento/${m.id}`} style={{ flex: 1, display: 'block' }}>
          <div className="list-item-header">
            <span className="list-item-title">{getCategoriaNombre(m)}</span>
            <div style={{ textAlign: 'right' }}>
              <span className={sentido === 'ingreso' ? 'list-item-amount-ingreso' : 'list-item-amount-egreso'}>
                {sentido === 'egreso' ? '-' : '+'}${m.monto.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="list-item-details">
            <span>{m.fecha}</span>
            {m.nombre_cliente && (
              <>
                <span>·</span>
                <span>{m.nombre_cliente}</span>
              </>
            )}
            <span className='legacy-card-detail-right'>{getMedioNombre(m)}</span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
          <DeleteButton 
            onClick={(e) => handleDeleteClick(e, m)}
            disabled={!canDeleteThis}
            title={canDeleteThis ? 'Eliminar movimiento' : 'No tienes permiso para eliminar este movimiento'}
          />
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <div className="desktop-content">
        <header className="desktop-content-header">
          <h1 className="desktop-content-title">Movimientos</h1>
        </header>

        {deleteError && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            borderRadius: '8px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#fca5a5',
            fontSize: '14px',
          }}>
            {deleteError}
          </div>
        )}

        <div className="list-filters">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.sentido})</option>
            ))}
          </select>
          <select
            value={filtroMedioPago}
            onChange={(e) => setFiltroMedioPago(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todos los medios de pago</option>
            {mediosPago.map((mp) => (
              <option key={mp.id} value={mp.id}>{mp.nombre}</option>
            ))}
          </select>
          <DateInputWithPlaceholder
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            placeholder="Desde"
            className="list-filter-input"
          />
          <DateInputWithPlaceholder
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            placeholder="Hasta"
            className="list-filter-input"
          />
          <AdminOnly>
          <button onClick={exportCSV} className="list-btn-export">
            Exportar CSV
          </button>
          </AdminOnly>
        </div>

        <div className="desktop-content-main">
          <div className="list-items">
            {visibles.map(renderMovimientoItem)}
            {visibles.length === 0 && (
              <p className="list-empty">Sin movimientos con estos filtros.</p>
            )}
          </div>
        </div>

        {/* Modal de confirmación */}
        {deleteTarget && (
          <DeleteConfirmModal
            movimiento={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            isDeleting={isDeleting}
          />
        )}
      </div>
    );
  }

  // Mobile layout
  return (
    <>
      <header className="list-header">
        <h1 className="title-primary">Movimientos</h1>
      </header>

      <main className="list-main">
        {deleteError && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            borderRadius: '8px',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            color: '#fca5a5',
            fontSize: '14px',
          }}>
            {deleteError}
          </div>
        )}

        {/* Filtros */}
        <div className="list-filters">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.sentido})</option>
            ))}
          </select>
          <select
            value={filtroMedioPago}
            onChange={(e) => setFiltroMedioPago(e.target.value)}
            className="list-filter-select"
          >
            <option value="todos">Todos los medios</option>
            {mediosPago.map((mp) => (
              <option key={mp.id} value={mp.id}>{mp.nombre}</option>
            ))}
          </select>
          <DateInputWithPlaceholder
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            placeholder="Desde"
            className="list-filter-input"
          />
          <DateInputWithPlaceholder
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            placeholder="Hasta"
            className="list-filter-input"
          />
          <AdminOnly>
            <button onClick={exportCSV} className="list-btn-export">
              CSV
            </button>
          </AdminOnly>
        </div>

        {/* Lista de movimientos */}
        <div className="list-items">
          {visibles.map(renderMovimientoItem)}
          {visibles.length === 0 && (
            <p className="list-empty">Sin movimientos con estos filtros.</p>
          )}
        </div>
      </main>

      {/* Modal de confirmación */}
      {deleteTarget && (
        <DeleteConfirmModal
          movimiento={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

export default function MovimientosPage() {
  return (
    <AppLayout mobileContainerClass="list-container">
      <MovimientosContent />
    </AppLayout>
  );
}
