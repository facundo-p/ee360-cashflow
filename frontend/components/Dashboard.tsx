// Dashboard: vista compuesta para desktop con todas las secciones visibles
import React, { useState, useCallback } from 'react';
import FormMovimiento from './FormMovimiento';
import DailySummary from './DailySummary';
import DailyMovementsList from './DailyMovementsList';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMovementCreated = useCallback(() => {
    // Increment key to trigger refresh of dependent components
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          {new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      <div className="dashboard-grid">
        {/* Movement form - always visible */}
        <section className="dashboard-panel dashboard-panel-form">
          <FormMovimiento mode="create" embedded onSuccess={handleMovementCreated} />
        </section>

        {/* Daily summary */}
        <section className="dashboard-panel dashboard-panel-summary">
          <DailySummary compact refreshKey={refreshKey} />
        </section>

        {/* Daily movements list */}
        <section className="dashboard-panel dashboard-panel-list">
          <DailyMovementsList compact refreshKey={refreshKey} limit={8} />
        </section>
      </div>
    </div>
  );
}
