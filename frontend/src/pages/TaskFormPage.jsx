import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/api';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

const EMPTY_FORM = { title: '', description: '', dueDate: '', priority: 'Medium', status: 'Pending' };

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    const loadTask = async () => {
      try {
        const res = await taskApi.getOne(token, id);
        const task = res.data;
        setForm({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.slice(0, 10),
          priority: task.priority,
          status: task.status,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, isEdit, token]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim() || !form.dueDate) {
      setError('Title, description, and due date are required');
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await taskApi.update(token, id, form);
      } else {
        await taskApi.create(token, form);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading task..." />;

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit Task' : 'New Task'}</h1>

      <form className="task-form" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />

        <label htmlFor="title">Title</label>
        <input id="title" className="input" value={form.title} onChange={handleChange('title')} />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="input"
          rows={4}
          value={form.description}
          onChange={handleChange('description')}
        />

        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="input"
          value={form.dueDate}
          onChange={handleChange('dueDate')}
        />

        <label htmlFor="priority">Priority</label>
        <select id="priority" className="input" value={form.priority} onChange={handleChange('priority')}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {isEdit && (
          <>
            <label htmlFor="status">Status</label>
            <select id="status" className="input" value={form.status} onChange={handleChange('status')}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
