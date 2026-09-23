import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/api';
import SummaryCards from '../components/SummaryCards';
import TaskFilters from '../components/TaskFilters';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const DEFAULT_SUMMARY = { total: 0, completed: 0, pending: 0, highPriority: 0 };

export default function Dashboard() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: '',
    order: 'asc',
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await taskApi.getAll(token, filters);
      setTasks(res.data);
      setSummary(res.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  // Debounce so we don't fire a request on every keystroke while searching
  useEffect(() => {
    const timeout = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timeout);
  }, [fetchTasks]);

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await taskApi.update(token, task._id, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await taskApi.remove(token, id);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      <SummaryCards summary={summary} />

      <TaskFilters filters={filters} onChange={setFilters} />

      <ErrorMessage message={error} />

      {loading ? (
        <Loader label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks found. Try adjusting your filters or create a new task.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
