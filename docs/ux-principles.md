Principios de UX – App Contable Gimnasio (MVP)
Contexto de uso (clave)

La aplicación será utilizada principalmente desde el celular, por coaches:

en medio de una clase

con poco tiempo

con atención parcial

generalmente usando una sola mano

La interfaz debe ser mobile-first, pensada para pantallas chicas y uso rápido.

Objetivo principal

Registrar un movimiento de dinero en ≤ 5 segundos, con:

mínimo esfuerzo cognitivo

mínimo número de interacciones

sin necesidad de scrollear

Si es más lento que anotarlo a mano → falló la UX.

Principios fundamentales
1. Mobile-first real

Diseñar primero para celular, no adaptar desktop

Todo lo importante debe verse sin scrollear

Botones grandes, claros y fáciles de tocar

Nada crítico escondido

2. Speed > estética

Cada campo debe justificar su existencia

Defaults automáticos siempre que sea posible

El usuario confirma, no completa desde cero

3. Botonera como entrada principal

La carga de movimientos debe comenzar desde una botonera de tipos de movimiento:

Todos los tipos visibles en una sola pantalla

Sin scroll

Botones grandes

Claramente diferenciados (ej: ingresos vs egresos)

Ejemplo:

Plan mensual – efectivo

Plan mensual – transferencia

Venta de bebida

Otros

Esto reduce decisiones y acelera la carga.

4. Flujo en dos pasos máximo

Elegir tipo de movimiento (botonera)

Confirmar datos en formulario precargado

No más pantallas intermedias.

5. Formularios sin scroll

En la pantalla de formulario:

Todos los campos visibles sin scrollear

El botón “Registrar movimiento” siempre visible

No usar modales ni acordeones

6. Teclado y velocidad

Autofocus inteligente

Enter guarda

Inputs numéricos simples

Orden lógico de tabulación

7. Defaults inteligentes

Al seleccionar un tipo de movimiento:

Se define ingreso / egreso

Se sugiere monto

Se sugiere medio de pago

Se setea fecha = hoy

El usuario solo corrige excepciones.

8. Campo “Nombre del cliente” (contextual)

Para movimientos relacionados con planes de socios (mensual o semestral):

Mostrar un campo opcional:

“Nombre del cliente”

No obligatorio

Editable más adelante desde el movimiento

Este campo no debe aparecer para movimientos donde no tiene sentido (ej: venta de bebida).

9. Feedback inmediato

Confirmación visual clara al guardar

Mensaje corto (“Movimiento registrado ✔”)

Luego de registrarse un movimiento, se vuelve a la pantalla anterior, la de la botonera.

Pantalla crítica: Flujo de carga

Este es el corazón del sistema.

Requisitos obligatorios:

Botonera visible sin scroll

Formulario visible sin scroll

CTA visible sin scroll

Flujo completo en ≤ 5 segundos

Todo lo demás es secundario.

Métrica de éxito UX

Un coach puede:

registrar una cuota

registrar una venta

corregir un dato

sin pensar, casi de memoria, usando el celular.

10. Incluir un botón para acceder a otra pantalla de consulta de movimientos. En el caso de los admin, también dará acceso a ver totales del día (ingresos, egresos, balance) y un botón de "exportar CSV".


Este documento complementa product.md
y debe respetarse en todas las decisiones de interfaz.