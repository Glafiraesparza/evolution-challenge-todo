
import TaskItem from "./TaskItem";

function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h5 fw-bold mb-3">
          Lista de tareas ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">
            Todavía no tienes tareas. ¡Agrega la primera!
          </p>
        ) : (
          <div className="list-group">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TaskList;
