// Lee variables de entorno. Ajustar para manejo real de env.
export const env = {
  databaseUrl: process.env.DATABASE_URL ?? 'sqlite://./persistence/data.db',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  port: Number(process.env.PORT_BACK ?? 4000),
};


