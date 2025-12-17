// Servidor HTTP placeholder. Reemplazar con framework elegido (ej. Express/Fastify).
import { registerRoutes } from './src/routes';

function createApp() {
  const app: any = {
    routes: [],
    get(path: string, handler: any) {
      this.routes.push({ method: 'GET', path, handler });
    },
    post(path: string, handler: any) {
      this.routes.push({ method: 'POST', path, handler });
    },
    put(path: string, handler: any) {
      this.routes.push({ method: 'PUT', path, handler });
    },
    listen(_port: number, cb: () => void) {
      cb();
    },
  };
  return app;
}

const app = createApp();
registerRoutes(app);
app.listen(4000, () => {
  console.log('Backend scaffold listo en puerto 4000 (mock).');
});


