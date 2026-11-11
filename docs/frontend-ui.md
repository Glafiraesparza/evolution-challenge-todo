# Documentación del frontend — Interfaz de usuario

## 1. Objetivo

Desarrollar una interfaz web para administrar tareas mediante React, Vite y Bootstrap, con un diseño sencillo, responsive y fácil de utilizar.

## 2. Tecnologías utilizadas

- React: desarrollo de componentes e interfaz.
- Vite: entorno de desarrollo frontend.
- Bootstrap: diseño de formularios, botones y tarjetas.
- CSS: personalización visual y adaptación a dispositivos móviles.

## 3. Componentes desarrollados

| Archivo | Función |
|---|---|
| `Header.jsx` | Muestra el encabezado y el estado de conexión con el backend. |
| `TaskForm.jsx` | Permite crear y editar tareas. |
| `TaskList.jsx` | Muestra el listado de tareas y el mensaje de lista vacía. |
| `TaskItem.jsx` | Representa una tarea y permite editarla, completarla o eliminarla. |
| `App.jsx` | Integra los componentes y administra temporalmente las tareas mediante el estado local de React. |
| `styles/app.css` | Define los estilos personalizados y responsive. |

## 4. Funcionalidades implementadas

- Visualización de tareas.
- Creación de tareas.
- Edición de título y descripción.
- Cambio entre estados pendiente y completada.
- Eliminación de tareas con confirmación.
- Validación básica del título.
- Mensaje cuando no existen tareas.
- Indicador de conexión con el backend.
- Diseño adaptable a computadoras y dispositivos móviles.

## 5. Pruebas realizadas

Se realizaron pruebas manuales desde el navegador para comprobar la visualización de componentes, creación, edición, eliminación y cambio de estado de las tareas.

También se comprobó la visualización de la interfaz en diferentes tamaños de pantalla y la conexión con el backend mediante el indicador de estado.

## 6. Estado actual y pendientes

La interfaz funciona con datos temporales administrados mediante `useState`. Las tareas creadas todavía no se almacenan en SQLite y desaparecen al recargar la página.

Está pendiente integrar el hook `useTasks.js` y el servicio `taskService.js` desarrollados por el integrante 2, una vez que estén disponibles, para conectar las funcionalidades con la API REST.

## 7. Rama de trabajo

`feature/frontend-ui`

Los cambios se desarrollan en esta rama y se integrarán a `develop` mediante un Pull Request después de su revisión.