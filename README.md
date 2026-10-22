# ToDo Refactor Starter

Proyecto inicial para **ToDo Refactor Lab**: refactorización, pruebas unitarias y Pair Programming.

## Inicio

```bash
npm install
npm test
```

Durante el desarrollo:

```bash
npm run test:watch
```

La primera prueba está preparada para fallar: es el punto de partida de la **Misión 2** y del ciclo **RED → GREEN → REFACTOR**.

## Estructura

- `src/legacy.js`: código funcional simple para analizar antes de cambiar.
- `src/taskService.js`: lógica de dominio que completarás misión por misión.
- `src/app.js`: interfaz inicial; en la Misión 9 deberá delegar la lógica a `taskService.js`.
- `tests/taskService.test.js`: suite incremental de pruebas unitarias con Vitest.

## Misión 0 · Antes de modificar código

**1. ¿Dónde almacenarías ahora el estado `completada` de una tarea?**
Con el modelo de strings no hay un lugar natural. Las opciones serían un array paralelo (`completadas[i]`), que se desincroniza al eliminar o reordenar, o codificarlo dentro del texto (`"✔ Diseñar pruebas"`), que mezcla dato con presentación y obliga a "parsear" el string. Ninguna es mantenible: la tarea necesita ser un objeto con una propiedad `completada`.

**2. ¿Qué ocurriría si mañana cada tarea necesita prioridad, fecha o responsable?**
Cada atributo nuevo sería otro array paralelo u otra convención dentro del string. Habría que modificar en sincronía `render`, el alta y la baja; cualquier `splice` olvidado en un array paralelo corrompe los datos sin error visible. Con objetos, agregar un atributo es agregar una propiedad.

**3. ¿Qué parte del código representa datos y qué parte representa interfaz?**
- Datos: el array `tareas` (y en `app.js`, también `filtro`).
- Interfaz: `querySelector`, `innerHTML`, la plantilla `<li>…</li>` y los listeners.
- Mezclado: `mostrarTareas()` recorre los datos y escribe en el DOM en el mismo ciclo. En `app.js`, el `submit` valida, muta (`push`) y renderiza; la eliminación usa el **índice del DOM** para hacer `splice` sobre los datos.

**4. ¿Qué comportamiento debemos conservar durante el refactor?**
Lo que el usuario observa: la lista inicial, el alta de títulos válidos, el rechazo de títulos vacíos con mensaje, la eliminación de la tarea elegida y el total en el resumen.

Hallazgos adicionales (no se corrigen todavía para no mezclar refactor con corrección de errores):
- El título se inserta con `innerHTML` sin escapar: un título como `<img src=x onerror=alert(1)>` se ejecuta como HTML.
- Eliminar por índice dejará de funcionar en cuanto la lista se muestre filtrada (el índice visible no coincide con el índice real).
- Los botones de filtro todavía no filtran.

### Comportamientos observables que NO deben cambiar (base de regresión)

1. Al cargar, se muestran las 3 tareas iniciales en este orden: "Revisar requisitos", "Diseñar pruebas", "Refactorizar código".
2. Un título válido se recorta (`trim`), se agrega **al final** de la lista, el campo se limpia y el total aumenta en 1.
3. Un título vacío o sólo con espacios **no** se agrega y se muestra "Escribe un título antes de agregar.".
4. "Eliminar" quita exactamente esa tarea (las demás conservan su orden) y el total disminuye en 1.

## Registro RED → GREEN → REFACTOR

Documenta al menos una iteración:

- **RED:** ¿qué prueba escribiste y por qué falló?
- **GREEN:** ¿cuál fue el cambio mínimo que la hizo pasar?
- **REFACTOR:** ¿qué mejoraste sin cambiar el comportamiento?

## Pair Programming

Registra por misión quién fue **Driver** y quién **Navigator**. Intercambien roles con frecuencia y no hagan commit hasta que ambos puedan explicar el código y la prueba.
