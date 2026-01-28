// DTOs de autenticación según AUTH_AND_USERS.md

/** Request para login */
export type LoginRequest = {
  username: string;
  password: string;
};

/** Response del login */
export type LoginResponse = {
  token: string;
};
