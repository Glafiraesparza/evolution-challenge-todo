// frontend/src/hooks/useTasks.js
// Hook que administra el estado de las tareas usando taskService.js.
// No tiene interfaz visual: App.jsx lo usa y pasa los datos a los componentes.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ids de tareas con una operación en curso (evita envíos duplicados)
  const pendingIds = useRef(new Set());
  // Indica si hay una creación en curso
  const creating = useRef(false);
  // Evita actualizar el estado si el componente ya se desmontó
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Carga (o recarga) la lista completa desde el backend
  const reloadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      if (mounted.current) setTasks(data);
      return data;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  // Carga inicial al montar el componente
  useEffect(() => {
    reloadTasks().catch(() => {
      // El error ya quedó guardado en el estado "error"
    });
  }, [reloadTasks]);

  // Crear tarea: agrega la tarea que devuelve el POST
  const addTask = useCallback(async (data) => {
    if (creating.current) {
      throw new Error("Ya se está guardando una tarea. Espera un momento.");
    }
    creating.current = true;
    setError(null);
    try {
      const created = await createTask(data);
      if (mounted.current) setTasks((prev) => [...prev, created]);
      return created;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      creating.current = false;
    }
  }, []);

  // Editar tarea: reemplaza la tarea con la que devuelve el PUT
  const editTask = useCallback(async (id, data) => {
    if (pendingIds.current.has(id)) {
      throw new Error("Ya hay una operación en curso para esta tarea.");
    }
    pendingIds.current.add(id);
    setError(null);
    try {
      const updated = await updateTask(id, data);
      if (mounted.current) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
      return updated;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      pendingIds.current.delete(id);
    }
  }, []);

  // Eliminar tarea: la quita del estado solo si el DELETE fue exitoso
  const removeTask = useCallback(async (id) => {
    if (pendingIds.current.has(id)) {
      throw new Error("Ya hay una operación en curso para esta tarea.");
    }
    pendingIds.current.add(id);
    setError(null);
    try {
      await deleteTask(id);
      if (mounted.current) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
      return true;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      pendingIds.current.delete(id);
    }
  }, []);

  // Completar / reabrir: obtiene la tarea actual y hace PUT con completed invertido
  const toggleTask = useCallback(async (id) => {
    if (pendingIds.current.has(id)) {
      throw new Error("Ya hay una operación en curso para esta tarea.");
    }
    pendingIds.current.add(id);
    setError(null);
    try {
      const current = await getTask(id);
      const updated = await updateTask(id, {
        title: current.title,
        description: current.description,
        completed: !current.completed,
      });
      if (mounted.current) {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
      return updated;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      pendingIds.current.delete(id);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    reloadTasks,
    addTask,
    editTask,
    removeTask,
    toggleTask,
  };
}