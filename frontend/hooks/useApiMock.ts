// Cliente mock en memoria/localStorage para simular API con latencia mínima.
export function useApiMock() {
  const delay = (ms = 50) => new Promise((res) => setTimeout(res, ms));
  return {
    get: async <T>(value: T, ms = 50) => {
      await delay(ms);
      return value;
    },
    post: async <T>(value: T, ms = 50) => {
      await delay(ms);
      return value;
    },
  };
}


