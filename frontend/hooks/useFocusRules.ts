// Decide foco y teclado: si hay monto sugerido no abre teclado; si no, autofocus en monto.
type FocusDecision = {
  shouldOpenKeyboard: boolean;
  initialTarget: 'guardar' | 'monto';
};

export function useFocusRules(hasMontoSugerido: boolean): FocusDecision {
  if (hasMontoSugerido) {
    return { shouldOpenKeyboard: false, initialTarget: 'guardar' };
  }
  return { shouldOpenKeyboard: true, initialTarget: 'monto' };
}


