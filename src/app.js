/*
 * MISIÓN 9 · ADAPTADOR DE INTERFAZ
 *
 * Este archivo contiene una versión inicial de interfaz basada en strings para
 * que la aplicación pueda observarse desde el comienzo. Cuando llegues a la
 * Misión 9, reemplaza la lógica de datos por llamadas a taskService.js.
 * El DOM debe leer eventos, delegar reglas al servicio y renderizar resultados.
 */

/*
 * MISIÓN 1 · ADAPTADOR DE INTERFAZ
* ¿qué propiedades pertenecen realmente a una tarea y cuáles pertenecen a la interfaz?
* Las propiedades que pertenecen a la tarea (dominio) son id, titulo y completada
* porque definen el estado de los datos. Lo que pertenece a la interfaz es el
* diseño visual, el HTML (<li>), los estilos CSS y los eventos de clic del navegador.
 */

import {
  crearTarea,
  agregarTarea,
  eliminarTarea,
  cambiarEstado,
  obtenerPendientes,
  obtenerTerminadas,
  obtenerResumen
} from "./taskService.js";

// Referencias al DOM
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

// Estado de la aplicación
let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtroActual = "todas";

// Obtención de tareas según filtro activo
function obtenerTareasFiltradas() {
  if (filtroActual === "pendientes") return obtenerPendientes(tareas);
  if (filtroActual === "terminadas") return obtenerTerminadas(tareas);
  return tareas;
}

// Renderizado (Adaptador visual)
function render() {
  list.innerHTML = "";
  const tareasAMostrar = obtenerTareasFiltradas();

  tareasAMostrar.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = `task ${tarea.completada ? "completed" : ""}`;
    li.innerHTML = `
      <span class="title" data-toggle="${tarea.id}">${tarea.titulo}</span>
      <span class="task-actions">
        <button data-toggle="${tarea.id}">
          ${tarea.completada ? "Desmarcar" : "Completar"}
        </button>
        <button data-delete="${tarea.id}">Eliminar</button>
      </span>
    `;
    list.appendChild(li);
  });

  const resumen = obtenerResumen(tareas);
  summary.textContent = `Total: ${resumen.total} | Pendientes: ${resumen.pendientes} | Terminadas: ${resumen.terminadas}`;
}

// Manejo de Eventos
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }

  const nuevaTarea = crearTarea(Date.now(), titulo);
  tareas = agregarTarea(tareas, nuevaTarea);

  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const deleteId = event.target.dataset.delete;
  const toggleId = event.target.dataset.toggle;

  if (deleteId !== undefined) {
    tareas = eliminarTarea(tareas, Number(deleteId));
    render();
    return;
  }

  if (toggleId !== undefined) {
    tareas = cambiarEstado(tareas, Number(toggleId));
    render();
  }
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filtroActual = button.dataset.filter;
    filters.forEach((b) => b.classList.toggle("active", b === button));
    message.textContent = "";
    render();
  });
});

render();