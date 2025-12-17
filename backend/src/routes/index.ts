// Registro de rutas (placeholder). Integrar con framework HTTP.
import { AuthController } from '../controllers/auth.controller';
import { MovimientosController } from '../controllers/movimientos.controller';
import { TiposController } from '../controllers/tipos.controller';
import { MediosController } from '../controllers/medios.controller';
import { UsuariosController } from '../controllers/usuarios.controller';

export function registerRoutes(app: any) {
  app.post('/auth/login', AuthController.login);
  app.get('/movimientos', MovimientosController.list);
  app.post('/movimientos', MovimientosController.create);
  app.get('/movimientos/:id', MovimientosController.get);
  app.put('/movimientos/:id', MovimientosController.update);
  app.get('/tipos-movimiento', TiposController.list);
  app.get('/medios-pago', MediosController.list);
  app.get('/usuarios', UsuariosController.list);
}


