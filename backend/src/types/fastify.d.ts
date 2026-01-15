import { UsuarioDTO } from '../dto/usuarios.dto';

// Extend Fastify's Request type to include our user
declare module 'fastify' {
  interface FastifyRequest {
    user?: UsuarioDTO;
  }
}
