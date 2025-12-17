// Cliente mock compartido para simular latencia mínima y respuestas predecibles.
export const mockDelay = (ms = 50) => new Promise((res) => setTimeout(res, ms));


