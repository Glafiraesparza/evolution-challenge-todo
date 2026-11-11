
import { useEffect, useState } from "react";

function TaskForm({ onSubmit, initialValues = null, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isEditing = Boolean(initialValues);

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
  }, [initialValues]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle || cleanTitle.length > 150) {
      return;
    }

    const taskData = {
      title: cleanTitle,
      description: description.trim(),
      completed: initialValues?.completed ?? false,
    };

    try {
      await onSubmit(taskData);

      if (!isEditing) {
        setTitle("");
        setDescription("");
      }
    } catch {
      // El componente padre se encarga de mostrar el error.
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <h3 className="h5 fw-bold mb-3">
          {isEditing ? "Editar tarea" : "Nueva tarea"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="task-title" className="form-label">
              Título de la tarea
            </label>

            <input
              id="task-title"
              type="text"
              className="form-control"
              placeholder="Ej. Terminar proyecto"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="task-description" className="form-label">
              Descripción (opcional)
            </label>

            <textarea
              id="task-description"
              className="form-control"
              placeholder="Agrega más detalles..."
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Guardar cambios" : "Agregar tarea"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
