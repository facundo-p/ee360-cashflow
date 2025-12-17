Producto: App Web de Registro Contable para Gimnasio (MVP)
1. Propósito del producto

Esta aplicación es una app web interna para un gimnasio, diseñada para registrar ingresos y egresos de dinero de forma extremadamente rápida y simple.

El sistema será utilizado principalmente por coaches en medio de una clase, por lo que la velocidad de carga de datos es prioritaria. Registrar un movimiento debe ser igual o más rápido que anotarlo a mano en un cuaderno.

Este documento define el alcance, reglas de negocio, UX, arquitectura y restricciones del MVP inicial.

2. Alcance del MVP (estricto)

El MVP incluye exclusivamente:

Registro de movimientos de dinero (ingresos y egresos)

Consulta y filtrado de movimientos históricos

Cálculo de totales y balance

Exportación de datos (CSV)

Gestión básica de usuarios y roles

Gestión de tipos de movimiento (plantillas)

Queda explícitamente fuera de alcance para esta versión:

Gestión de alumnos

Planes o vencimientos

Asistencia

Mensajería (email / WhatsApp)

Facturación

Integraciones externas

La arquitectura debe quedar preparada para crecer, pero sin implementar estas funcionalidades.

3. Contexto operativo

El sistema modela un solo gimnasio

Moneda única: Peso argentino (ARS)

Uso interno, no público

4. Usuarios y permisos
Admin

Ver todos los movimientos

Crear, editar y eliminar movimientos

Exportar movimientos en CSV

Crear y administrar usuarios

Crear, editar y activar/desactivar tipos de movimiento

Usuario

Ver todos los movimientos

Crear movimientos

Editar solo los movimientos creados por él

Solo puede editar movimientos dentro de las últimas 24 horas

No puede borrar movimientos

No puede exportar datos

5. Movimiento de dinero (entidad principal)
Campos obligatorios

Fecha

Por defecto: fecha actual

Editable

Monto

Número positivo

Tipo

Ingreso o Egreso

Medio de pago

Efectivo

Transferencia

Mercado Pago

Débito

Crédito

Tipo de movimiento (plantilla)

Usuario creador

Campos opcionales

Nota / descripción

Reglas

Los montos siempre son positivos

El signo lógico lo define ingreso/egreso

Auditoría interna de cambios (no visible en UI)

Se recomienda soft delete

6. Tipos de movimiento (plantillas)

Los tipos de movimiento sirven para acelerar la carga de datos y son configurables por un admin desde la UI.

Cada tipo puede definir:

Si es ingreso o egreso

Monto sugerido

Medio de pago sugerido

Ejemplos iniciales:

Plan mensual – efectivo

Plan mensual – transferencia

Plan semestral – efectivo

Plan semestral – transferencia

Venta de bebida

Otros

7. Principios de UX (obligatorios)

La UX debe priorizar rapidez y simplicidad por sobre estética.

Principios clave:

Mínimo número de clicks

Uso intensivo de teclado

Autofocus inteligente

Defaults automáticos

Enter para confirmar

Formularios en una sola pantalla

Feedback visual inmediato

Objetivo:

Crear un movimiento en ≤ 5 segundos

Ideal para uso en contexto físico (clase en curso)

8. Pantallas del MVP
8.1 Login

Email

Contraseña

Sin registro público

Usuarios creados por admin

8.2 Dashboard / Pantalla principal

Funciona como pantalla de acceso rápido.

Elementos:

Botón grande: “➕ Nuevo movimiento”

Totales visibles:

Ingresos del día

Egresos del día

Balance

Filtro rápido por fecha (hoy / mes)

8.3 Crear movimiento (pantalla crítica)

Pantalla optimizada para carga ultra rápida.

Formulario:

Fecha (default hoy)

Tipo de movimiento (dropdown grande)

Al seleccionar:

se define ingreso/egreso

se sugiere monto

se sugiere medio de pago

Monto (editable)

Medio de pago

Nota (opcional)

Botón grande “Guardar”

UX obligatoria:

Autofocus inicial

Enter guarda

Confirmación inmediata

Opción “Guardar y cargar otro”

8.4 Listado de movimientos

Tabla simple con:

Fecha

Tipo (ingreso/egreso)

Tipo de movimiento

Medio de pago

Monto

Usuario

Funcionalidades:

Filtros:

rango de fechas

ingreso / egreso

tipo de movimiento

Ordenamiento

Edición (según permisos)

Exportar CSV (solo admin)

8.5 Gestión de tipos de movimiento (Admin)

Listado de tipos

Crear / editar

Activar / desactivar

Definir valores por defecto

8.6 Gestión de usuarios (Admin)

Crear usuario

Asignar rol

Activar / desactivar

9. Reglas de negocio clave

Un usuario solo puede editar sus propios movimientos

Límite de edición: 24 horas desde la creación

No se permite borrar definitivamente datos

Validaciones en frontend y backend

10. Stack tecnológico y restricciones
Stack sugerido

Frontend: Next.js + React + TypeScript

Backend: API REST (Next.js API routes o Node.js simple)

Base de datos: PostgreSQL

Autenticación: email + contraseña

Restricciones

Solo herramientas compatibles con hosting gratuito

No Redis

No servicios pagos

Infraestructura simple

Ejemplos válidos:

Supabase (free)

Railway (free)

Neon (free)

Vercel (free)

11. Criterios de calidad

Código claro y simple

Priorizar legibilidad sobre abstracción

Evitar sobre–ingeniería

Preparado para crecer sin bloquear decisiones futuras

12. Modo de trabajo esperado

Desarrollar de forma incremental:

Setup del proyecto

Autenticación

CRUD de movimientos

UX de carga rápida

Listado y filtros

Exportación CSV

Roles y permisos