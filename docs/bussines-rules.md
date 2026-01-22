# Reglas de Negocio – Backend

Este documento define las **reglas de negocio obligatorias** que deben respetarse en la implementación del backend. Su objetivo es servir como fuente única de verdad para controllers, services y validaciones, independientemente de la UI o del motor de persistencia.

---

## 1. Roles y permisos

### 1.1 Roles existentes

* `admin`
* `user` (o cualquier rol distinto de `admin`)

> Cualquier rol distinto de `admin` debe considerarse **no administrador** a efectos de permisos.

---

## 2. Movimientos

### 2.1 Autoría y auditoría

* Todo movimiento **DEBE** registrar:

  * `created_by_user_id`
  * `created_at`
  * `updated_by_user_id` (nullable)
  * `updated_at` (nullable)

* Cada edición de un movimiento **DEBE**:

  * actualizar `updated_by_user_id`
  * actualizar `updated_at`
  * generar un registro en `auditoria_movimientos`

---

### 2.2 Permisos de edición

* Un usuario **NO admin**:

  * ❌ NO puede editar movimientos creados por otros usuarios.
  * ❌ NO puede editar movimientos fuera de la ventana temporal permitida (si aplica, ver 2.3).

* Un usuario `admin`:

  * ✅ Puede editar cualquier movimiento.

---

### 2.3 Ventana temporal de edición (usuarios no admin)

* Un usuario NO admin solo puede editar un movimiento:

  * si fue creado por él mismo
  * y si fue creado dentro de las últimas **24 horas**

* Pasado ese plazo:

  * ❌ la edición debe ser rechazada
  * ✅ el movimiento sigue siendo visible

> El admin no tiene restricción temporal.

---

### 2.4 Detección de movimientos duplicados

Al intentar crear un nuevo movimiento, el sistema **DEBE advertir** (no necesariamente bloquear) si existe un movimiento previo que cumpla **TODAS** las siguientes condiciones:

* mismo `tipo_movimiento_id`
* mismo `medio_pago_id`
* mismo `monto`
* mismo `nombre_cliente` (o ambos null)
* misma fecha (`fecha_movimiento`)

#### Comportamiento esperado

* La API debe devolver una advertencia explícita:

  * `warning: posible_movimiento_duplicado`
* El frontend decide si:

  * permite continuar
  * solicita confirmación

> Esta regla busca prevenir errores humanos sin entorpecer el flujo rápido.

---

### 2.5 Validaciones básicas obligatorias

* `monto`:

  * debe ser mayor a 0
* `fecha_movimiento`:

  * no puede ser futura
* `categoria_movimiento`:

  * debe existir
  * debe estar activo al momento de la creación
* `medio_pago`:

  * debe existir
  * debe estar activo al momento de la creación

---

## 3. Tipos de movimiento

### 3.1 Permisos

* Solo usuarios con rol `admin` pueden:

  * crear tipos de movimiento
  * editar tipos de movimiento
  * activar / desactivar tipos de movimiento

* Usuarios NO admin:

  * ❌ no pueden realizar ninguna operación de escritura
  * ✅ solo pueden listar tipos activos para carga

---

### 3.2 Restricciones funcionales

* Un tipo de movimiento desactivado:

  * ❌ no puede usarse para crear nuevos movimientos
  * ✅ puede seguir apareciendo en movimientos históricos

* Un tipo de movimiento puede definir:

  * `sentido` (ingreso / egreso)
  * `monto_sugerido`
  * `medio_pago_sugerido`
  * `es_plan`

---

## 4. Medios de pago

### 4.1 Permisos

* Solo usuarios `admin` pueden:

  * crear
  * editar
  * activar / desactivar
  * cambiar orden

* Usuarios NO admin:

  * ❌ no pueden modificar medios de pago

---

### 4.2 Uso en movimientos

* Solo medios de pago activos pueden:

  * mostrarse como opción
  * sugerirse automáticamente

* Si un movimiento histórico usa un medio de pago hoy inactivo:

  * ✅ debe mostrarse
  * ❌ no debe sugerirse para nuevos movimientos

---

## 5. Usuarios

### 5.1 Visibilidad

* Un usuario NO admin:

  * ❌ no puede listar usuarios
  * ❌ no puede modificar roles

* Un usuario admin:

  * ✅ puede listar
  * ✅ puede crear
  * ✅ puede editar

---

## 6. Reglas transversales

### 6.1 Separación de capas

* Las reglas de negocio **DEBEN** vivir en la capa de `services`.
* Controllers:

  * no deben contener reglas de negocio
  * solo adaptar HTTP → servicio

---

### 6.2 Independencia de UI

* Ninguna regla de negocio debe depender de:

  * layout (mobile / desktop)
  * componentes frontend
  * flujos de navegación

> La UI puede ocultar acciones, pero el backend **DEBE** validar siempre.

---

## 7. Principio general

> **Toda acción sensible debe ser validada por el backend, incluso si el frontend no expone esa acción.**

Este documento debe actualizarse ante cualquier cambio funcional relevante.
