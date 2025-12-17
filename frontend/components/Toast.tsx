// Toast para feedback inmediato post-acción (guardar, error breve).
import React from 'react';

type Props = { message: string };

export default function Toast({ message }: Props) {
  return (
    <div role="status" aria-live="polite">
      {message}
    </div>
  );
}


