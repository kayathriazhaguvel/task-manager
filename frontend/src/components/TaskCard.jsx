import { Link } from 'react-router-dom';

const priorityClass = { Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high' };
const statusClass = { Pending: 'badge-pending', Completed: 'badge-completed' };

export default function TaskCard({ task, onToggleStatus, onDelete }) {
  const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="task-card">
      <div className="task-card-header">
        <Link to={`/tasks/${task._id}`} className="task-title">
          {task.title}
        </Link>
        <div className="badges">
          <span className={`badge ${priorityClass[task.priority]}`}>{task.priority}</span>
          <span className={`badge ${statusClass[task.status]}`}>{task.status}</span>
        </div>
      </div>

      <p className="task-description">{task.description}</p>
      <p className="task-due">Due: {formattedDate}</p>

      <div className="task-actions">
        <button className="btn btn-small" onClick={() => onToggleStatus(task)}>
          Mark {task.status === 'Completed' ? 'Pending' : 'Completed'}
        </button>
        <Link to={`/tasks/${task._id}/edit`} className="btn btn-small btn-secondary">
          Edit
        </Link>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
