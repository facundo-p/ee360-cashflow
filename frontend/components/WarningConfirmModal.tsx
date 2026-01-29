import React from 'react';

type WarningConfirmModalProps = {
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing?: boolean;
  };
  
  export function WarningConfirmModal({
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
    isProcessing = false,
  }: WarningConfirmModalProps) {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-icon-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4m0 4h.01M10.29 3.86l-8.59 15A1 1 0 002.59 21h18.82a1 1 0 00.87-1.5l-8.59-15a1 1 0 00-1.74 0z" />
            </svg>
          </div>
  
          <h2 className="modal-title">{title}</h2>
  
          <p className="modal-message">
            {message}
          </p>
  
          <div className="modal-actions">
            <button
              onClick={onCancel}
              className="modal-btn-secondary"
              disabled={isProcessing}
            >
              {cancelLabel}
            </button>
  
            <button
              onClick={onConfirm}
              className="modal-btn-primary"
              disabled={isProcessing}
            >
              {isProcessing ? 'Procesando...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }
  