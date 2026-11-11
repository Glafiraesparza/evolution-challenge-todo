// frontend/src/services/taskService.js
// Servicio REST para las tareas. Solo hace peticiones HTTP; no maneja estado.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TASKS_URL = `${API_URL}/tasks`;

// Convierte la respuesta de error del backend en un mensaje legible.
async function buildErrorMessage(response) {
  let detail = null;

  try {
    const body = await response.json();
    detail = body.detail;
  } catch {
    // La respuesta de error no traía JSON; usamos un mensaje genérico.
  }

  // 422 de FastAPI: detail es un arreglo de errores
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(". ");
  }

  // 404 del contrato: detail es un texto ("Tarea no encontrada")
  if (typeof detail === "string") {
    return detail;
  }

  return `Error ${response.status} al comunicarse con el servidor`;
}

// Ejecuta fetch y lanza un Error si falla la red o el HTTP no es exitoso.
async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    // Error de red: backend apagado, sin internet, CORS, etc.
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que el backend esté activo."
    );
  }

  if (!response.ok) {
    const error = new Error(await buildErrorMessage(response));
    error.status = response.status;
    throw error;
  }

  // DELETE devuelve 204 sin cuerpo: no se debe llamar response.json()
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Opciones comunes para POST y PUT (envían JSON)
function jsonOptions(method, data) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function getTasks() {
  return request(TASKS_URL);
}

export function getTask(id) {
  return request(`${TASKS_URL}/${id}`);
}

export function createTask(data) {
  return request(TASKS_URL, jsonOptions("POST", data));
}

export function updateTask(id, data) {
  return request(`${TASKS_URL}/${id}`, jsonOptions("PUT", data));
}

export function deleteTask(id) {
  return request(`${TASKS_URL}/${id}`, { method: "DELETE" });
}