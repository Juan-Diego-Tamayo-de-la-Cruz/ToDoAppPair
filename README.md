# ToDo Refactor Lab · ToDoAppPair

Caso de estudio de Ingeniería de Software (TecNM Celaya). Partimos de una ToDo App funcional basada en strings y la transformamos, en pasos pequeños y protegidos por pruebas, en una aplicación con un dominio de funciones puras (`taskService.js`) y una interfaz que sólo adapta (`app.js`).

| Integrante | GitHub |
|---|---|
| Juan Diego Tamayo de la Cruz | [@Juan-Diego-Tamayo-de-la-Cruz](https://github.com/Juan-Diego-Tamayo-de-la-Cruz) |
| Andrés Herrera Oettinghaus | [@AndresHerreraOettinghaus](https://github.com/AndresHerreraOettinghaus) |

## Comandos

```bash
npm install                      # instala Vitest
npm test                         # ejecuta la suite (36 pruebas)
npm run test:watch               # modo observación durante el desarrollo
npm test -- --reporter=verbose   # lista cada prueba por nombre
```

La aplicación se sirve por HTTP, porque `app.js` es un módulo ES y el navegador no carga módulos abiertos con doble clic (`file://`):

```bash
python -m http.server 8000       # o "Live Server" en VS Code
# abrir http://localhost:8000
```

## Estructura

| Archivo | Responsabilidad |
|---|---|
| `src/taskService.js` | Dominio: 12 funciones puras. Reciben datos, devuelven datos nuevos, no tocan el DOM ni modifican su entrada. |
| `src/app.js` | Adaptador: lee eventos, llama al dominio, guarda el nuevo estado y renderiza. |
| `src/legacy.js` | Sin cambios; punto de comparación de la Misión 0. |
| `tests/taskService.test.js` | 36 pruebas unitarias con Vitest (Arrange–Act–Assert). |
| `docs/evidencia/` | Capturas: suite en verde, fallo registrado en la Misión 5 y aplicación integrada. |
| `docs/reflexion.md` | Reflexión de pareja. |

```
evento del usuario → app.js → taskService.js (probado) → nuevo estado → render() → DOM
```

## Pair Programming: roles por misión

El Driver escribe y ejecuta (es el autor del commit); el Navigator revisa, propone casos de prueba y verifica que el comportamiento se conserve. Alternamos el rol en cada misión.

| Misión | Driver | Navigator | Commits |
|---|---|---|---|
| 0 · Comprender antes de cambiar | Juan Diego | Andrés | `docs(m0)` |
| 1 · String → objeto | Andrés | Juan Diego | `Mision 1` |
| 2 · `crearTarea` | Juan Diego | Andrés | `feat(m2)` |
| 3 · `agregarTarea` | Andrés | Juan Diego | `Mision 3` ×2 |
| 4 · `buscarTarea` | Juan Diego | Andrés | `test(m4)` → `feat(m4)` |
| 5 · `obtenerPendientes` / `obtenerTerminadas` | Andrés | Juan Diego | `Mision 5` → `Mision 5 Correcion` |
| 6 · `cambiarEstado` | Juan Diego | Andrés | `test(m6)` → `feat(m6)` |
| 7 · `eliminarTarea` | Andrés | Juan Diego | `Mision 7` |
| 8 · `obtenerResumen` | Juan Diego | Andrés | `test(m8)` → `feat(m8)` |
| 9 · Integración con la interfaz | Andrés | Juan Diego | `Mision 9` |
| 10 · Refactor final | Juan Diego | Andrés | 2 `fix`, 3 `test`, 5 `refactor` |
| 11 · Extensión D (duplicados) | Andrés | Juan Diego | `Mision 11` |
| Documentación y evidencia | Juan Diego | Andrés | `docs` |

Regla de salida: no se hace commit hasta que ambos puedan explicar el código y la prueba.

---

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

## Misión 1 · De string a objeto

```js
{ id: 1, titulo: "Revisar requisitos", completada: false }
```

**¿Qué propiedades pertenecen realmente a una tarea y cuáles a la interfaz?** *(respuesta de Andrés, antes en un comentario de `app.js`)*
Las propiedades que pertenecen a la tarea (dominio) son `id`, `titulo` y `completada`, porque definen el estado de los datos. Lo que pertenece a la interfaz es el diseño visual, el HTML (`<li>`), los estilos CSS y los eventos de clic del navegador.

---

## Decisiones de diseño

| Decisión | Por qué | Prueba que la protege |
|---|---|---|
| Funciones puras que devuelven colecciones nuevas | Pruebas deterministas, sin preparar DOM ni limpiar estado entre pruebas. | `devuelve una colección con un elemento más sin mutar la original`, `no muta el array ni el objeto original` |
| `find()` en `buscarTarea` | La intención es "encontrar uno"; devuelve `undefined` si no hay coincidencia. | `devuelve undefined si el id no existe` |
| `filter()` en pendientes, terminadas y **eliminar** | Eliminar es "conservar todas excepto una". `map()` no cambia el tamaño y `find()` sólo localiza. | `elimina un id existente` |
| `map()` + spread en `cambiarEstado` | Transforma conservando el tamaño; sólo la tarea afectada es un objeto nuevo. | `no altera las demás tareas` |
| `some()` en `existeTareaConTitulo` | La pregunta es sí/no: "¿existe alguna?". Se detiene en la primera coincidencia. | `detecta si existe una tarea con el mismo título exacto` |
| Identificar por `id`, no por índice (Misión 9) | Con un filtro activo el índice visible no coincide con el real. | Integración: "Eliminar con filtro activo" |
| `siguienteId` = mayor id + 1 (Misión 10) | `Date.now()` no es determinista ni se puede probar, y `length + 1` repite ids tras eliminar. | `no repite un id existente cuando hay huecos tras eliminar` |
| `validarTitulo` devuelve un código (`"vacio"`, `"duplicado"`) | El dominio decide *si* el título es válido; la interfaz decide *cómo* decirlo (tabla `MENSAJES`). | `un título con sólo espacios es inválido` |
| `obtenerResumen` compone `obtenerPendientes` / `obtenerTerminadas` | La regla "qué es terminada" vive en un solo lugar (ver Misión 8). | Las 3 pruebas de `obtenerResumen` |

**Misión 3: si `agregarTarea` modificara el array recibido, ¿qué prueba lo detecta?** `devuelve una colección con un elemento más sin mutar la original` comprueba `expect(resultado).not.toBe(tareasIniciales)`. Una versión con `push` que devolviera el mismo arreglo fallaría. Una verificación más estricta sería comparar el original contra una copia tomada en el Arrange, como hace `cambiarEstado > no muta el array ni el objeto original`.

**Misión 5: ¿qué devuelve `filter()` sin coincidencias?** `[]`, nunca `undefined` ni `null`. Así el código que lo consume puede usar `.length` o `.map()` sin casos especiales. Lo cubren `devuelve un arreglo vacío si no hay coincidencias` y `… para una colección vacía`.

**Misión 7: ¿`map()`, `filter()` o `find()` para eliminar?** `filter()`, porque eliminar es conservar todas excepto la del id.

**Misión 8: ¿reutilizar funciones o calcular directo?** En la Misión 8 las funciones de la Misión 5 aún no existían, así que el primer GREEN fue un `filter` y una resta. Hace un recorrido menos, pero duplica la regla "qué es terminada" y deduce las pendientes por resta. En la Misión 10, con la 5 ya hecha, el resumen pasó a componer las funciones probadas. Comunica mejor la intención y si cambia la definición de "pendiente" se cambia en un solo lugar. El recorrido extra es irrelevante con estas cantidades.

### Misión 10 · Refactor final (sólo lo justificable)

| Cambio | Problema que resolvía |
|---|---|
| `filtrarTareas(tareas, filtro)` en el dominio | `app.js` decidía qué tareas eran pendientes o terminadas (`obtenerTareasFiltradas`). |
| `validarTitulo(titulo, tareas)` en el dominio + tabla `MENSAJES` | Las reglas "vacío" y "duplicado" estaban dentro del listener de `submit`. |
| `siguienteId(tareas)` en lugar de `Date.now()` | Ids no deterministas generados en la interfaz; no se podían probar. |
| `obtenerResumen` compone funciones existentes | Regla duplicada (ver Misión 8). |
| Encabezados del starter sustituidos por el contrato de cada archivo; sin `void` en la suite | Los comentarios daban instrucciones ("completa estas funciones…") que ya no describían el código. |

Cada cambio se hizo con la suite en verde: primero la prueba de la función nueva (RED), luego el movimiento (GREEN), y después los escenarios de integración otra vez.

Considerados y **descartados**:
- Extraer predicados (`estaPendiente`, `tieneId`): cada condición es de una línea y aparece una o dos veces.
- Una clase `Tarea`: el objeto literal ya expresa el modelo y las funciones puras se prueban más fácil.
- Cambiar la definición de duplicado de la Misión 11: es una decisión de requisito, no de estructura.

### Correcciones de defectos (separadas del refactor)

Un refactor no cambia el comportamiento, así que estas correcciones van en commits `fix` propios.

| Entrada | Observado | Esperado | Corrección |
|---|---|---|---|
| Marcar "Diseñar pruebas" como completada | El `<li>` recibía la clase `completed`, que no existe en `styles.css`: el título no se tachaba. | Estilo de tarea terminada. | Clase `done` (`.task.done .title`). |
| Título `<img src=x onerror="window.__inyectado=1">` | `render()` usaba `innerHTML`: se creaba un `<img>` real y el script se ejecutaba. | El título se muestra como texto. | `crearItem()` con `createElement` + `textContent`. `app.js` ya no usa `innerHTML`. |
| Con el filtro "Pendientes", eliminar la 2.ª tarea visible | En el starter se eliminaba por índice: con filtro se borraría otra tarea. | Se elimina la tarea elegida. | Misión 9: `data-delete` con el `id` de la tarea. |

---

## Casos de prueba (36)

| Función | Casos | Tipo |
|---|---|---|
| `crearTarea` | crea `{ id, titulo, completada: false }` | normal |
| `agregarTarea` | la colección contiene la nueva tarea; un elemento más y arreglo nuevo | normal, efecto secundario |
| `buscarTarea` | id existente; id inexistente → `undefined`; colección vacía; `"2"` no es `2` | normal, frontera, contrato |
| `obtenerPendientes` / `obtenerTerminadas` | colección mixta; sin coincidencias → `[]`; colección vacía → `[]` | normal, frontera |
| `cambiarEstado` | pendiente → completada; completada → pendiente; no altera las demás; no muta array ni objeto; id inexistente | normal, frontera, efecto secundario |
| `eliminarTarea` | id existente; id inexistente deja la colección intacta; colección vacía | normal, frontera |
| `obtenerResumen` | 5 / 3 / 2 (caso del enunciado); vacía → ceros; todas terminadas | normal, frontera |
| `existeTareaConTitulo` | título exacto; mayúsculas y espacios; título inexistente | normal, frontera |
| `filtrarTareas` | `todas`, `pendientes`, `terminadas`; filtro desconocido → todas | normal, frontera |
| `validarTitulo` | título nuevo → `null`; `""` y sólo espacios → `"vacio"`; existente → `"duplicado"` | normal, frontera |
| `siguienteId` | vacía → 1; mayor + 1; huecos tras eliminar; colección desordenada | normal, frontera |

`coleccionMixta()` es una fábrica: cada prueba recibe su propia colección y ninguna depende de lo que otra haya hecho con los datos.

## Registro RED → GREEN → REFACTOR

**Iteración: `obtenerResumen` (Misiones 8 y 10)**
- **RED** (`test(m8)`): tres pruebas (5/3/2, colección vacía, todas terminadas) fallan con `Misión 8 pendiente`.
- **GREEN** (`feat(m8)`): cambio mínimo con un `filter` y una resta; 15/15 en verde.
- **REFACTOR** (Misión 10): con la Misión 5 ya hecha, el resumen compone `obtenerPendientes` y `obtenerTerminadas`. Siguen 36/36 en verde sin tocar las pruebas.

**Iteración: `siguienteId` (Misión 10)**
- **RED:** cuatro pruebas, entre ellas `no repite un id existente cuando hay huecos tras eliminar` (con `length + 1` saldría un id repetido).
- **GREEN:** `Math.max(0, ...ids) + 1`.
- **REFACTOR:** `app.js` deja `Date.now()` y pide el id al dominio. El escenario "ids únicos tras eliminar y agregar" sigue pasando.

### Registro de un fallo: commit `Mision 5`

| Entrada | Observado | Esperado | Corrección |
|---|---|---|---|
| `npm test` después del commit `Mision 5` | `SyntaxError: Identifier 'obtenerTerminadas' has already been declared`: la suite completa no cargó (*Tests: no tests*). | La suite ejecuta y pasan las pruebas de la Misión 5. | `Mision 5 Correcion`: se eliminó la declaración vieja que quedó duplicada. |

Lección: un error de sintaxis en el dominio no tumba una prueba, tumba todas. Por eso corremos `npm test` antes de cada commit ([captura](docs/evidencia/fallo-mision5.png)).

## Pruebas de integración manual

Ejecutadas en el navegador sobre la versión final. La columna "Antes de M10" muestra el resultado sobre el commit `Mision 11`.

| Escenario | Acción | Resultado esperado | Antes de M10 | Final |
|---|---|---|---|---|
| Alta válida | Escribir "  Escribir README  " y Agregar | Nueva tarea pendiente al final; cambia el resumen | ✔ | ✔ `Total: 4 \| Pendientes: 4 \| Terminadas: 0` |
| Alta inválida | Enviar sólo espacios | No se agrega; mensaje claro | ✔ | ✔ "Escribe un título antes de agregar." |
| Alta duplicada *(M11)* | Agregar " diseñar PRUEBAS " | No se agrega; mensaje claro | ✔ | ✔ "Ya existe una tarea con este título." |
| Cambio de estado | Completar "Diseñar pruebas" | Cambia estilo y contadores | ✘ contadores sí, sin tachado | ✔ tachado; `Pendientes: 3 \| Terminadas: 1` |
| Filtro | Pendientes / Terminadas / Todas | Sólo se muestran las del filtro | ✔ | ✔ 3 / 1 / 4 tareas |
| Eliminar | Eliminar "Escribir README" | Desaparece; se actualiza el resumen | ✔ | ✔ `Total: 3` |
| Eliminar con filtro | En Pendientes, eliminar "Refactorizar código" | Se elimina esa y no otra | ✔ | ✔ |
| Ids | Eliminar y agregar dos tareas | Ningún id repetido | ✔ (timestamps) | ✔ `1, 2, 3, 4` |
| Título con HTML | Agregar `<img src=x onerror=…>` | Se muestra como texto | ✘ el script se ejecutaba | ✔ texto literal |

## Misión 11 · Extensión elegida: D, evitar títulos duplicados

**¿Qué significa "duplicado"?** El mismo título después de quitar los espacios de inicio y fin (`trim`), sin distinguir mayúsculas y minúsculas. Los espacios internos y los acentos sí cuentan: "Diseñar  pruebas" (dos espacios) o "Disenar pruebas" no son duplicados de "Diseñar pruebas".

**Diseño.** `existeTareaConTitulo(tareas, titulo)` usa `some()`. Desde la Misión 10, `validarTitulo` la usa para devolver `"duplicado"`, y `app.js` sólo muestra el mensaje correspondiente.

**Costo del cambio.** La Misión 11 tocó `taskService.js` (+8 líneas), la suite (+23) y `app.js` (+9 / −1, para validar en el listener). Después del refactor, una regla nueva de títulos sólo cambiaría `validarTitulo`, sus pruebas y una entrada en `MENSAJES`; `render()` y los listeners no se tocarían.

## Evidencia

- [Suite en verde (36/36)](docs/evidencia/suite-verde.png)
- [Fallo registrado: commit `Mision 5`](docs/evidencia/fallo-mision5.png)
- [Aplicación integrada: tarea completada y rechazo de duplicado](docs/evidencia/app-integrada.png)
- [Reflexión de pareja](docs/reflexion.md)

## Referencias

- *ToDo Refactor Lab: Caso de estudio · Refactorización · Pruebas unitarias · Pair Programming*. Ingeniería de Software, 6.º semestre.
- Sofela, O. (2022). *Test-Driven Development Tutorial – How to Test Your JavaScript and ReactJS Applications*. freeCodeCamp. https://www.freecodecamp.org/news/test-driven-development-tutorial-how-to-test-javascript-and-reactjs-app/
- 4Tomik. *JS para gente que ya sabe programar* (YouTube): fundamentos 00:00:00, CRUD 00:35:24, Local Storage 01:20:51, filtros 01:55:00.
