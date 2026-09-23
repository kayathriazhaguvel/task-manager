import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function TaskDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const res = await taskApi.getOne(token, id);
        setTask(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await taskApi.remove(token, id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader label="Loading task..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!task) return null;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ‹ Back to Dashboard
      </Link>

      <div className="task-detail-card">
        <h1>{task.title}</h1>
        <div className="badges">
          <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
          <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
        </div>

        <p className="task-detail-description">{task.description}</p>
        <p>
          <strong>Due:</strong>{' '}
          {new Date(task.dueDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="task-actions">
          <Link to={`/tasks/${task._id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
