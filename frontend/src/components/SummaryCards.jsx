export default function SummaryCards({ summary }) {
  const items = [
    { label: 'Total Tasks', value: summary.total, className: 'card-total' },
    { label: 'Completed Tasks', value: summary.completed, className: 'card-completed' },
    { label: 'Pending Tasks', value: summary.pending, className: 'card-pending' },
    { label: 'High Priority Tasks', value: summary.highPriority, className: 'card-high' },
  ];

  return (
    <div className="summary-grid">
      {items.map((item) => (
        <div key={item.label} className={`summary-card ${item.className}`}>
          <p className="summary-value">{item.value}</p>
          <p className="summary-label">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
