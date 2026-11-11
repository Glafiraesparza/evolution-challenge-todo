
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className="list-group-item p-3">
      <div className="d-flex align-items-start gap-3">
        <input
          type="checkbox"
          className="form-check-input mt-1"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Cambiar estado de ${task.title}`}
        />

        <div className="flex-grow-1">
          <h3
            className={`h6 mb-1 ${
              task.completed
                ? "text-decoration-line-through text-muted"
                : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-muted small mb-2">
              {task.description}
            </p>
          )}

          <span
            className={`badge ${
              task.completed ? "bg-success" : "bg-warning text-dark"
            }`}
          >
            {task.completed ? "Completada" : "Pendiente"}
          </span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
          >
            Editar
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
