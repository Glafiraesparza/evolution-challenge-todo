# Contrato de API — To-Do List

**Proyecto:** The Evolution Challenge: From Code to Production

**Equipo:** Team 1 — Build It

**Versión:** 1.0

## 1. Configuración general

- Backend: Python + FastAPI.
- Base de datos: SQLite + SQLAlchemy.
- Frontend: React + Vite + Bootstrap.
- URL base: `http://localhost:8000`.
- Formato de intercambio: JSON.
- Documentación interactiva: `http://localhost:8000/docs`.

## 2. Modelo de datos: Task

| Campo | Tipo | Descripción |
|---|---|---|
| id | Integer | Identificador único autoincremental. |
| title | String | Título obligatorio, entre 1 y 150 caracteres. |
| description | String | Descripción opcional. Valor predeterminado: "". |
| completed | Boolean | Estado de la tarea. Valor predeterminado: false. |
| created_at | DateTime | Fecha de creación en UTC. |
| updated_at | DateTime | Fecha de última modificación en UTC. |

Ejemplo de una tarea:

```json
{
  "id": 1,
  "title": "Estudiar FastAPI",
  "description": "Revisar los endpoints del proyecto",
  "completed": false,
  "created_at": "2026-11-10T18:00:00Z",
  "updated_at": "2026-11-10T18:00:00Z"
}
```

## 3. Endpoints

| Método | Ruta | Función | Código exitoso |
|---|---|---|---|
| GET | /tasks | Obtener todas las tareas. | 200 |
| GET | /tasks/{id} | Obtener una tarea específica. | 200 |
| POST | /tasks | Crear una tarea. | 201 |
| PUT | /tasks/{id} | Actualizar una tarea. | 200 |
| DELETE | /tasks/{id} | Eliminar una tarea. | 204 |

### GET /tasks

Devuelve un arreglo JSON con todas las tareas.

Si no existen tareas, devuelve un arreglo vacío: `[]`.

### GET /tasks/{id}

Devuelve el objeto completo de la tarea solicitada.

Si no existe, devuelve 404.

### POST /tasks

Cuerpo de la petición:

```json
{
  "title": "Realizar proyecto",
  "description": "Completar el frontend",
  "completed": false
}
```

El título es obligatorio. La descripción y el estado son opcionales.

Devuelve la tarea completa creada, incluyendo su identificador y fechas, con código 201.

### PUT /tasks/{id}

Cuerpo de la petición:

```json
{
  "title": "Realizar proyecto",
  "description": "Frontend terminado",
  "completed": true
}
```

Los tres campos editables son obligatorios para actualizar una tarea.

Devuelve la tarea completa actualizada con código 200.

### DELETE /tasks/{id}

Elimina la tarea indicada.

Devuelve código 204 sin cuerpo de respuesta.

## 4. Validaciones y errores

- El título no puede estar vacío ni contener únicamente espacios.
- El título debe tener entre 1 y 150 caracteres después de eliminar espacios al inicio y al final.
- El identificador y las fechas son administrados por el backend.
- El campo completed debe ser booleano.
- Si una tarea no existe, se devuelve 404.
- Si los datos enviados son inválidos, se devuelve 422.

Ejemplo de error 404:

```json
{
  "detail": "Tarea no encontrada"
}
```

## 5. Endpoints de infraestructura

| Método | Ruta | Función |
|---|---|---|
| GET | / | Verificar que la API responde. |
| GET | /health | Comprobar el estado del backend. |
| GET | /health/db | Comprobar la conexión con SQLite. |

## 6. Acuerdos de integración

- El frontend consumirá la API mediante la variable VITE_API_URL.
- El backend será responsable de validar los datos.
- La base de datos se almacenará en un volumen persistente de Docker.
- Las tareas podrán marcarse como completadas mediante PUT.
- No se implementará autenticación ni gestión de múltiples usuarios en esta primera versión.
- Los cambios al contrato deberán comunicarse al equipo antes de implementarse.