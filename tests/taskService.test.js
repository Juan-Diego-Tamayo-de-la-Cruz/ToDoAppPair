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

describe("agregarTarea", () => {
  it("agrega la tarea al final sin modificar la colección original", () => {
    const tareas = [crearTarea(1, "Primera")];
    const nuevaTarea = crearTarea(2, "Segunda");

    const resultado = agregarTarea(tareas, nuevaTarea);

    expect(resultado).toEqual([...tareas, nuevaTarea]);
    expect(resultado).not.toBe(tareas);
    expect(tareas).toHaveLength(1);
  });
});

describe("buscarTarea", () => {
  it("devuelve la tarea con el id indicado o undefined si no existe", () => {
    const tarea = crearTarea(1, "Primera");
    const tareas = [tarea];

    expect(buscarTarea(tareas, 1)).toBe(tarea);
    expect(buscarTarea(tareas, 2)).toBeUndefined();
  });
});

describe("obtenerPendientes y obtenerTerminadas", () => {
  it("separa una colección mixta y devuelve colecciones vacías cuando corresponde", () => {
    const pendiente = crearTarea(1, "Pendiente");
    const terminada = { ...crearTarea(2, "Terminada"), completada: true };
    const tareas = [pendiente, terminada];

    expect(obtenerPendientes(tareas)).toEqual([pendiente]);
    expect(obtenerTerminadas(tareas)).toEqual([terminada]);
    expect(obtenerPendientes([terminada])).toEqual([]);
    expect(obtenerTerminadas([pendiente])).toEqual([]);
    expect(obtenerPendientes([])).toEqual([]);
    expect(obtenerTerminadas([])).toEqual([]);
  });
});

describe("cambiarEstado", () => {
  it("cambia sólo la tarea indicada sin mutar la colección original", () => {
    const primera = crearTarea(1, "Primera");
    const segunda = crearTarea(2, "Segunda");
    const tareas = [primera, segunda];

    const resultado = cambiarEstado(tareas, 1);

    expect(resultado).toEqual([{ ...primera, completada: true }, segunda]);
    expect(resultado[0]).not.toBe(primera);
    expect(tareas[0].completada).toBe(false);
  });

  it("conserva las tareas cuando el id no existe", () => {
    const tareas = [crearTarea(1, "Primera")];

    expect(cambiarEstado(tareas, 2)).toEqual(tareas);
  });
});

describe("eliminarTarea", () => {
  it("elimina sólo la tarea indicada y conserva el orden de las demás", () => {
    const tareas = [
      crearTarea(1, "Primera"),
      crearTarea(2, "Segunda"),
      crearTarea(3, "Tercera")
    ];

    expect(eliminarTarea(tareas, 2)).toEqual([tareas[0], tareas[2]]);
    expect(eliminarTarea(tareas, 4)).toEqual(tareas);
    expect(eliminarTarea([], 1)).toEqual([]);
  });
});

describe("obtenerResumen", () => {
  it("cuenta el total, pendientes y terminadas", () => {
    const tareas = [
      crearTarea(1, "Pendiente"),
      { ...crearTarea(2, "Terminada"), completada: true },
      { ...crearTarea(3, "Terminada"), completada: true }
    ];

    expect(obtenerResumen(tareas)).toEqual({
      total: 3,
      pendientes: 1,
      terminadas: 2
    });
  });

  it("devuelve ceros para una colección vacía", () => {
    expect(obtenerResumen([])).toEqual({
      total: 0,
      pendientes: 0,
      terminadas: 0
    });
  });
});
