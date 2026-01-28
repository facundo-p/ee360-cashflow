# Autenticación y Usuarios – EE360 Cashflow

Este documento define el comportamiento esperado del sistema de autenticación y gestión de usuarios.
Debe considerarse la **fuente de verdad** para cualquier implementación relacionada con auth y usuarios.

---

## 1. Autenticación

- La aplicación **solo puede usarse luego de iniciar sesión**.
- El mecanismo de autenticación es **JWT**.
- Cada request protegida debe validar:
  - Token JWT válido
  - Usuario existente
  - Usuario activo

### 1.1 Tokens
- Se utiliza **un solo JWT** (no refresh token).
- El JWT tiene expiración finita de 8hs. Crear archivo backend/src/config/auth.ts con esto parametrizado de la siguiente manera: export const JWT_EXPIRES_IN_SECONDS = 60 * 60 * 8;
- El logout consiste en eliminar el token del frontend.


### 1.2 Login
- Endpoint: POST /api/auth/login

- Credenciales:
- `username`
- `password`

---

### 1.3 JWT
- Tipo: JSON Web Token (JWT)
- Duración: **8 horas**
- La duración debe estar definida en **un único lugar configurable** (constante o config).
- El token debe incluir:
- `userId`
- `rol`
- Endpoint para obtener el usuario autenticado: GET /api/auth/me

---

## 2. Usuarios

### 2.1 Roles
Existen únicamente dos roles:
- `admin`
- `coach`

### 2.2 Campos del usuario
Campos mínimos requeridos:
- `id`
- `nombre`
- `username` (único) -> validar que sea un email válido en el ABM
- `password_hash`
- `rol` (`admin` | `coach`)
- `activo` (boolean)
- `created_at`
- `updated_at`

### 2.2.1 Identidad
- Campo principal: `username`
- El `username` **debe tener formato de email válido**
- La validación de email se realiza:
- al crear usuario
- al editar usuario
- No se permite crear ni actualizar usuarios con username inválido.

### 2.3 Passwords
- Nunca se almacenan en texto plano.
- Se utiliza **bcrypt** para el hash.
- El backend nunca devuelve passwords ni hashes.

---

## 3. Permisos

### 3.1 Reglas generales
- Todo endpoint protegido debe validar el JWT.
- El backend es responsable de validar permisos (no el frontend).

### 3.2 Permisos de Admin
Solo usuarios con rol `admin` pueden:
- Crear usuarios
- Editar usuarios
- Habilitar / deshabilitar usuarios
- Cambiar passwords de otros usuarios
- Acceder al ABM de usuarios
- Acceder a ABM de medios de pago
- Acceder a AMB de categorías de movimiento
- Acceder a ABM de opciones

#### Coach
- Puede operar la aplicación normalmente.
- No puede:
    - crear usuarios
    - editar usuarios
    - acceder a funcionalidades de administración.
    - editar movimientos que el no haya creado.
    - editar movimientos que el haya creado hace más de 24hs.

### 3.3 Usuarios deshabilitados
- Un usuario con `activo = false`:
  - No puede iniciar sesión
  - No puede usar un JWT existente
  - Es tratado como no autorizado

---

## 4. Frontend

### 4.1 Login
- Pantalla de login obligatoria al iniciar la app.
- No se puede acceder a ninguna pantalla sin estar autenticado.

### 4.2 Layout
- Mobile y Desktop:
  - Ícono de usuario en la esquina superior derecha
  - Al clickear:
    - Mostrar nombre del usuario logueado
    - Opción de logout

- Desktop (solo admin):
  - ABM de usuarios:
    - Crear
    - Editar
    - Activar / desactivar
    - Cambiar password
- Acceder a ABM de medios de pago
- Acceder a AMB de categorías de movimiento
- Acceder a ABM de opciones

---

## 5. Alcance y Exclusiones

- No implementar impersonación de usuarios.
- No usar OAuth ni servicios externos (Auth0, Clerk, etc).
- Mantener el resto de la app sin cambios funcionales.

---

## 6. Principios

- Simplicidad antes que sofisticación.
- Seguridad básica bien implementada.
- Consistencia con la arquitectura existente (API / Controllers / Services / Repositories).
- El backend debe estar preparado para:
- cambiar duración del JWT sin modificar lógica
- agregar futuras mejoras (refresh tokens, lock de cuenta, etc.)
