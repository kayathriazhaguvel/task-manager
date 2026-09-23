export default function TaskFilters({ filters, onChange }) {
  const handleField = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by title..."
        value={filters.search}
        onChange={handleField('search')}
        className="input"
      />

      <select value={filters.status} onChange={handleField('status')} className="input">
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <select value={filters.priority} onChange={handleField('priority')} className="input">
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={filters.sortBy} onChange={handleField('sortBy')} className="input">
        <option value="">Sort By...</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>

      <select value={filters.order} onChange={handleField('order')} className="input">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
