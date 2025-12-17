Permisos y roles – App Contable Gimnasio (MVP)
Roles del sistema

El sistema tiene dos roles:

admin

usuario

No existen otros roles en el MVP.

Permisos por rol
Admin

Puede:

Ver todos los movimientos

Crear movimientos

Editar cualquier movimiento (sin límite de tiempo)

Eliminar movimientos (preferentemente soft delete)

Exportar movimientos en CSV

Crear, editar y desactivar usuarios

Crear, editar y desactivar tipos de movimiento

Acceder a todos los reportes

Usuario

Puede:

Ver todos los movimientos

Crear movimientos

Editar solo los movimientos creados por él

Editar movimientos solo dentro de las primeras 24 horas desde su creación

No puede:

Eliminar movimientos

Exportar datos

Gestionar usuarios

Gestionar tipos de movimiento

Reglas generales

Los permisos deben validarse siempre en el backend

El frontend puede ocultar acciones, pero no es la fuente de verdad

Si un usuario no tiene permiso:

el backend debe devolver un error claro (403)

Las reglas de permisos deben ser consistentes en:

API

UI

validaciones

Casos especiales

Si un usuario intenta editar un movimiento fuera de las 24 horas:

la acción debe ser rechazada

se debe mostrar un mensaje claro al usuario

Los admins no tienen restricciones temporales

Alcance

Este documento aplica solo al MVP.
Cualquier nuevo rol o permiso debe agregarse explícitamente aquí.

Este archivo es la referencia única para reglas de permisos.