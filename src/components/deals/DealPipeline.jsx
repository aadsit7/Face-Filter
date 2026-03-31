import Badge from '../ui/Badge';
import StatusPill from '../ui/StatusPill';

const columns = [
  { key: 'submitted', label: 'Submitted', color: 'border-amber-400 bg-amber-50' },
  { key: 'approved', label: 'Approved', color: 'border-blue-400 bg-blue-50' },
  { key: 'in_progress', label: 'In Progress', color: 'border-cyan-400 bg-cyan-50' },
  { key: 'closed', label: 'Closed (Won/Lost)', color: 'border-green-400 bg-green-50' },
];

function formatValue(value) {
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }
  return `$${value}`;
}

const productVariant = {
  'Right Click Tools': 'info',
  'Application Workspace': 'purple',
  'Privileged Access': 'warning',
};

export default function DealPipeline({ deals }) {
  const getDealsForColumn = (key) => {
    if (key === 'closed') {
      return deals.filter((d) => d.status === 'won' || d.status === 'lost');
    }
    return deals.filter((d) => d.status === key);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((col) => {
        const colDeals = getDealsForColumn(col.key);
        return (
          <div key={col.key} className={`rounded-xl border-t-4 ${col.color} min-h-[300px]`}>
            <div className="flex items-center justify-between p-3">
              <h3 className="text-sm font-semibold text-recast-navy">{col.label}</h3>
              <Badge variant="default" size="sm">
                {colDeals.length}
              </Badge>
            </div>
            <div className="px-3 pb-3 space-y-3 max-h-[500px] overflow-y-auto">
              {colDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white rounded-lg border border-recast-gray-200 p-3 hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-sm text-recast-navy">{deal.customerName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={productVariant[deal.product] || 'default'} size="sm">
                      {deal.product}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-recast-gray-700">
                      {formatValue(deal.estimatedValue)}
                    </span>
                    <span className="text-xs text-recast-gray-500">{deal.expectedCloseDate}</span>
                  </div>
                  <div className="mt-2">
                    <StatusPill status={deal.status} />
                  </div>
                </div>
              ))}
              {colDeals.length === 0 && (
                <p className="text-xs text-recast-gray-400 text-center py-6">No deals</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
