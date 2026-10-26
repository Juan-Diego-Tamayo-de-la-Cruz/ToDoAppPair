/*
 * DOMINIO DE TAREAS
 *
 * Funciones puras: reciben datos y devuelven datos nuevos. Ninguna modifica
 * la colección ni los objetos recibidos, y ninguna conoce el DOM; por eso se
 * prueban sin navegador en tests/taskService.test.js.
 *
 * Tarea: { id: number, titulo: string, completada: boolean }
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
  // Retorna todas las tareas cuyo id sea DIFERENTE al id que se quiere eliminar
  return tareas.filter(tarea => tarea.id !== id);
}

// MISIÓN 8
export function obtenerResumen(tareas) {
  return {
    total: tareas.length,
    pendientes: obtenerPendientes(tareas).length,
    terminadas: obtenerTerminadas(tareas).length
  };
}

// MISIÓN 11:
export function existeTareaConTitulo(tareas, titulo) {
  const tituloNormalizado = titulo.trim().toLowerCase();
  return tareas.some(
    tarea => tarea.titulo.trim().toLowerCase() === tituloNormalizado
  );
}

// MISIÓN 10: reglas movidas desde app.js
export function siguienteId(tareas) {
  return Math.max(0, ...tareas.map(tarea => tarea.id)) + 1;
}

export function filtrarTareas(tareas, filtro) {
  if (filtro === "pendientes") return obtenerPendientes(tareas);
  if (filtro === "terminadas") return obtenerTerminadas(tareas);
  return tareas;
}

// Devuelve un código de error o null. El texto del mensaje es de la interfaz.
export function validarTitulo(titulo, tareas) {
  if (titulo.trim() === "") return "vacio";
  if (existeTareaConTitulo(tareas, titulo)) return "duplicado";
  return null;
}
