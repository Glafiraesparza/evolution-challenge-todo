
import { useEffect, useState } from "react";
import { checkHealth } from "./services/api";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const exampleTasks = [
  {
    id: 1,
    title: "Estudiar React",
    description: "Repasar componentes y props",
    completed: false,
  },
  {
    id: 2,
    title: "Configurar Docker",
    description: "Verificar los contenedores",
    completed: true,
  },
];

function App() {
  const [status, setStatus] = useState("Conectando...");
  const [tasks, setTasks] = useState(exampleTasks);
  const [editingTask, setEditingTask] = useState(null);

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
    const newTask = {
      id: Date.now(),
      ...taskData,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  // Estas funciones se implementarán en los siguientes pasos.
  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTask = (id) => {
    console.log("Eliminar:", id);
  };

  const handleToggleTask = (id) => {
    console.log("Cambiar estado:", id);
  };

  const handleUpdateTask = async (taskData) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...taskData }
          : task
      )
    );

    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header status={status} />

      <main className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Mis tareas</h2>
          <p className="text-muted">
            Organiza tus actividades de manera sencilla.
          </p>
        </div>

        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialValues={editingTask}
          onCancel={handleCancelEdit}
        />

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
        />
      </main>
    </div>
  );
}

export default App;
