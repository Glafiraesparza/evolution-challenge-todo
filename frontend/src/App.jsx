
import { useEffect, useState } from "react";

import { checkHealth } from "./services/api";
import { useTasks } from "./hooks/useTasks";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [status, setStatus] = useState("Conectando...");
  const [editingTask, setEditingTask] = useState(null);
  const [actionError, setActionError] = useState(null);

  const {
    tasks,
    loading,
    error,
    reloadTasks,
    addTask,
    editTask,
    removeTask,
    toggleTask,
  } = useTasks();

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setStatus(data.status === "ok" ? "Conectado" : "Error");
      })
      .catch(() => {
        setStatus("Sin conexión");
      });
  }, []);

  const handleCreateTask = async (taskData) => {
    setActionError(null);
    try {
      await addTask(taskData);
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setActionError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;

    setActionError(null);
    try {
      await editTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta tarea?"
    );

    if (!confirmed) return;

    setActionError(null);
    try {
      await removeTask(id);
      setEditingTask((currentTask) =>
        currentTask?.id === id ? null : currentTask
      );
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleToggleTask = async (id) => {
    setActionError(null);
    try {
      await toggleTask(id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setActionError(null);
  };

  return (
    <div className="todo-app">
      <Header status={status} />

      <main className="container todo-container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Mis tareas</h2>
          <p className="text-muted">
            Organiza tus actividades de manera sencilla.
          </p>
        </div>

        {(actionError || error) && (
          <div className="alert alert-danger" role="alert">
            <strong>Error: </strong>
            {actionError || error}
            <button
              type="button"
              className="btn-close float-end"
              aria-label="Cerrar error"
              onClick={() => setActionError(null)}
            />
          </div>
        )}

        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialValues={editingTask}
          onCancel={handleCancelEdit}
        />

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando tareas...</span>
            </div>
            <p className="mt-2 text-muted">Cargando tareas...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggle={handleToggleTask}
          />
        )}

        {error && (
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => reloadTasks().catch(() => {})}
            >
              Reintentar conexión
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
