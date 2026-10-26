/*
 * TODO REFACTOR LAB · LÓGICA DE DOMINIO
 *
 * Completa estas funciones misión por misión. Favorece funciones que reciben
 * datos y devuelven datos, sin acceder al DOM. Ejecuta la suite después de
 * cada cambio.
 */

// MISIÓN 2
export function crearTarea(id, titulo) {
  return { id, titulo, completada: false };
}

// MISIÓN 3
export function agregarTarea(tareas, nuevaTarea) {
  // Devuelve una NUEVA colección copiando las tareas anteriores y sumando la nueva
  return [...tareas, nuevaTarea];
}

// MISIÓN 4
export function buscarTarea(tareas, id) {
  // find() devuelve la primera tarea con ese id, o undefined si no existe
  return tareas.find(tarea => tarea.id === id);
}

// MISIÓN 5
export function obtenerPendientes(tareas) {
  // Retorna solo las tareas donde completada sea false
  return tareas.filter(tarea => !tarea.completada);
}

export function obtenerTerminadas(tareas) {
  // Retorna solo las tareas donde completada sea true
  return tareas.filter(tarea => tarea.completada);
}

// MISIÓN 6
export function cambiarEstado(tareas, id) {
  // map() conserva el tamaño; spread crea un objeto nuevo sólo para la tarea afectada
  return tareas.map(tarea =>
    tarea.id === id
      ? { ...tarea, completada: !tarea.completada }
      : tarea
  );
}

// MISIÓN 7
export function eliminarTarea(tareas, id) {
  // TODO: conservar todos excepto el id indicado.
  throw new Error("Misión 7 pendiente: implementar eliminarTarea()");
}

// MISIÓN 8
export function obtenerResumen(tareas) {
  const terminadas = tareas.filter(tarea => tarea.completada).length;
  return { total: tareas.length, pendientes: tareas.length - terminadas, terminadas };
}
