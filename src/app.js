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

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const summary = document.querySelector("#summary");
const filters = [...document.querySelectorAll("[data-filter]")];

let tareas = [
  { id: 1, titulo: "Revisar requisitos", completada: false },
  { id: 2, titulo: "Diseñar pruebas", completada: false },
  { id: 3, titulo: "Refactorizar código", completada: false }
];
let filtro = "todas";

function render() {
  list.innerHTML = "";
  tareas.forEach((tarea, index) => {
    const li = document.createElement("li");
    li.className = "task";
    li.innerHTML = `<span class="title">${tarea.titulo}</span>
      <span class="task-actions"><button data-delete="${index}">Eliminar</button></span>`;
    list.appendChild(li);
  });
  summary.textContent = `Total: ${tareas.length}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = input.value.trim();
  if (!titulo) {
    message.textContent = "Escribe un título antes de agregar.";
    return;
  }
  tareas.push({ id: Date.now(), titulo, completada: false }); // código deliberadamente acoplado/mutable para refactorizar
  input.value = "";
  message.textContent = "";
  render();
});

list.addEventListener("click", (event) => {
  const index = event.target.dataset.delete;
  if (index === undefined) return;
  tareas.splice(Number(index), 1); // otro punto deliberado de refactor
  render();
});

filters.forEach(button => button.addEventListener("click", () => {
  filtro = button.dataset.filter;
  filters.forEach(b => b.classList.toggle("active", b === button));
  message.textContent = `Filtro '${filtro}' pendiente de integrar durante el refactor.`;
}));

render();
