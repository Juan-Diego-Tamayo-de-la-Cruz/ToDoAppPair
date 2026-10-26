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
  filtrarTareas,
  obtenerResumen,
  validarTitulo
} from "./taskService.js";

// Referencias al DOM
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

// Textos de la interfaz para cada código de validarTitulo()
const MENSAJES = {
  vacio: "Escribe un título antes de agregar.",
  duplicado: "Ya existe una tarea con este título."
};

// Estado de la aplicación
let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtroActual = "todas";

// Renderizado (Adaptador visual)
// Cada nodo se crea con createElement y el título se asigna con textContent:
// el texto del usuario nunca se interpreta como HTML.
function crearBoton(texto, accion, id) {
  const boton = document.createElement("button");
  boton.textContent = texto;
  boton.dataset[accion] = id;
  return boton;
}

function crearItem(tarea) {
  const li = document.createElement("li");
  li.className = tarea.completada ? "task done" : "task";

  const titulo = document.createElement("span");
  titulo.className = "title";
  titulo.dataset.toggle = tarea.id;
  titulo.textContent = tarea.titulo;

  const acciones = document.createElement("span");
  acciones.className = "task-actions";
  acciones.append(
    crearBoton(tarea.completada ? "Desmarcar" : "Completar", "toggle", tarea.id),
    crearBoton("Eliminar", "delete", tarea.id)
  );

  li.append(titulo, acciones);
  return li;
}

function render() {
  list.replaceChildren(...filtrarTareas(tareas, filtroActual).map(crearItem));

  const resumen = obtenerResumen(tareas);
  summary.textContent = `Total: ${resumen.total} | Pendientes: ${resumen.pendientes} | Terminadas: ${resumen.terminadas}`;
}

// Manejo de Eventos
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  const error = validarTitulo(titulo, tareas);

  if (error) {
    message.textContent = MENSAJES[error];
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