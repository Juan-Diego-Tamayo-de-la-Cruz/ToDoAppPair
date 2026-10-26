import { describe, it, expect } from "vitest";
import {
  crearTarea,
  agregarTarea,
  buscarTarea,
  obtenerPendientes,
  obtenerTerminadas,
  cambiarEstado,
  eliminarTarea,
  obtenerResumen
} from "../src/taskService.js";

/*
 * TODO REFACTOR LAB · SUITE STARTER
 *
 * Activa/crea pruebas misión por misión. No escribas todas las soluciones de
 * una vez. Para cada comportamiento sigue RED → GREEN → REFACTOR.
 */

// Fábrica de datos: cada prueba recibe su propia colección, así ninguna
// prueba depende de lo que otra haya hecho con los datos.
const coleccionMixta = () => [
  { id: 1, titulo: "Revisar requisitos", completada: true },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];

describe("crearTarea", () => {
  it("crea una tarea pendiente con id y título", () => {
    // Arrange
    const id = 10;
    const titulo = "Diseñar pruebas";

    // Act
    const tarea = crearTarea(id, titulo);

    // Assert
    expect(tarea).toEqual({ id: 10, titulo: "Diseñar pruebas", completada: false });
  });
});

// MISIÓN 3: agrega al menos dos pruebas para agregarTarea().
describe("agregarTarea", () => {
  it("agrega una nueva tarea a la colección", () => {
    // Arrange
    const tareasIniciales = [{ id: 1, titulo: "Tarea 1", completada: false }];
    const nuevaTarea = { id: 2, titulo: "Tarea 2", completada: false };

    // Act
    const resultado = agregarTarea(tareasIniciales, nuevaTarea);

    // Assert
    expect(resultado).toContainEqual(nuevaTarea);
  });

  it("devuelve una colección con un elemento más sin mutar la original", () => {
    // Arrange
    const tareasIniciales = [{ id: 1, titulo: "Tarea 1", completada: false }];
    const nuevaTarea = { id: 2, titulo: "Tarea 2", completada: false };

    // Act
    const resultado = agregarTarea(tareasIniciales, nuevaTarea);

    // Assert
    expect(resultado.length).toBe(tareasIniciales.length + 1);
    expect(resultado).not.toBe(tareasIniciales); // Verifica que es un arreglo nuevo
  });
});

// MISIÓN 4: prueba id existente e inexistente para buscarTarea().
describe("buscarTarea", () => {
  it("encuentra la tarea con un id existente", () => {
    // Arrange
    const tareas = coleccionMixta();

    // Act
    const tarea = buscarTarea(tareas, 2);

    // Assert
    expect(tarea).toEqual({ id: 2, titulo: "Diseñar pruebas", completada: false });
  });

  it("devuelve undefined si el id no existe", () => {
    expect(buscarTarea(coleccionMixta(), 99)).toBeUndefined();
  });

  it("devuelve undefined en una colección vacía", () => {
    expect(buscarTarea([], 1)).toBeUndefined();
  });

  it("compara el id con igualdad estricta: '2' no es 2", () => {
    // Contrato para la interfaz: dataset siempre entrega strings,
    // así que app.js debe convertir con Number() antes de llamar.
    expect(buscarTarea(coleccionMixta(), "2")).toBeUndefined();
  });
});

// MISIÓN 5: prueba colección mixta, sin coincidencias y vacía.
// MISIÓN 6: prueba cambio correcto, otra tarea intacta e id inexistente.
describe("cambiarEstado", () => {
  it("marca como completada una tarea pendiente", () => {
    const resultado = cambiarEstado(coleccionMixta(), 2);

    expect(buscarTarea(resultado, 2).completada).toBe(true);
  });

  it("devuelve a pendiente una tarea completada", () => {
    const resultado = cambiarEstado(coleccionMixta(), 1);

    expect(buscarTarea(resultado, 1).completada).toBe(false);
  });

  it("no altera las demás tareas", () => {
    const resultado = cambiarEstado(coleccionMixta(), 2);

    expect(resultado.filter(t => t.id !== 2)).toEqual(
      coleccionMixta().filter(t => t.id !== 2)
    );
  });

  it("no muta el array ni el objeto original", () => {
    // Arrange
    const tareas = coleccionMixta();
    const original = tareas[1];

    // Act
    cambiarEstado(tareas, 2);

    // Assert
    expect(tareas).toEqual(coleccionMixta());
    expect(original.completada).toBe(false);
  });

  it("con un id inexistente conserva el contenido", () => {
    expect(cambiarEstado(coleccionMixta(), 99)).toEqual(coleccionMixta());
  });
});

// MISIÓN 7: prueba eliminar existente, inexistente y colección vacía.
// MISIÓN 8: prueba obtenerResumen(), incluyendo colección vacía.

// Los imports anteriores quedan preparados para que construyas la suite de forma incremental.
void agregarTarea;
void obtenerPendientes;
void obtenerTerminadas;
void eliminarTarea;
void obtenerResumen;
