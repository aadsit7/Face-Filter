import Card from '../ui/Card';
import Table from '../ui/Table';
import StatusPill from '../ui/StatusPill';

const columns = [
  { key: 'quarter', label: 'Quarter' },
  {
    key: 'revenue',
    label: 'Revenue',
    render: (val) => `$${val.toLocaleString()}`,
  },
  {
    key: 'rebateRate',
    label: 'Rate',
    render: (_val, row) => row.rebateRate || '5%',
  },
  {
    key: 'rebateEarned',
    label: 'Rebate',
    render: (val) => `$${val.toLocaleString()}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <StatusPill status={val === 'paid' ? 'completed' : val} />,
  },
];

export default function RebateTable({ rebateData }) {
  return (
    <Card title="Rebate Summary">
      <div className="mb-4 flex items-center gap-4">
        <div>
          <span className="text-sm text-recast-gray-500">Current Tier:</span>{' '}
          <span className="font-semibold text-recast-navy">{rebateData.currentTier}</span>
        </div>
        <div>
          <span className="text-sm text-recast-gray-500">Rebate Rate:</span>{' '}
          <span className="font-semibold text-recast-navy">{rebateData.rate}</span>
        </div>
      </div>
      <Table columns={columns} data={rebateData.quarters} />
    </Card>
  );
}
