/*
 * MISIÓN 0 · CÓDIGO LEGACY PARA ANALIZAR
 *
 * Este ejemplo funciona, pero representa las tareas como strings y mezcla
 * datos con manipulación del DOM. NO lo refactorices todavía: primero explica
 * qué responsabilidades están mezcladas y qué comportamientos deben conservarse.
 */

let tareas = [
  "Revisar requisitos",
  "Diseñar pruebas",
  "Refactorizar código"
];

function mostrarTareas() {
  const lista = document.querySelector("#task-list");
  lista.innerHTML = "";

  for (let i = 0; i < tareas.length; i++) {
    lista.innerHTML += `<li>${tareas[i]}</li>`;
  }
}

// mostrarTareas();
