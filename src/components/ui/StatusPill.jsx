const statusColorMap = {
  submitted: 'bg-amber-100 text-amber-800',
  pending: 'bg-amber-100 text-amber-800',
  not_started: 'bg-amber-100 text-amber-800',
  approved: 'bg-cyan-100 text-cyan-800',
  in_progress: 'bg-cyan-100 text-cyan-800',
  won: 'bg-green-100 text-green-800',
  earned: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  resolved: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
  open: 'bg-orange-100 text-orange-800',
};

function formatStatus(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusPill({ status }) {
  const colorClasses = statusColorMap[status] || 'bg-recast-gray-100 text-recast-gray-700';

  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium px-3 py-1 ${colorClasses}`}
    >
      {formatStatus(status)}
    </span>
  );
}
