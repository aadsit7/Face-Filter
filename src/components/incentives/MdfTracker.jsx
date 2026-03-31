import Card from '../ui/Card';
import Button from '../ui/Button';
import Table from '../ui/Table';
import StatusPill from '../ui/StatusPill';

const columns = [
  { key: 'submittedDate', label: 'Date' },
  { key: 'activity', label: 'Description' },
  {
    key: 'amount',
    label: 'Amount',
    render: (val) => `$${val.toLocaleString()}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <StatusPill status={val} />,
  },
];

function fmt(n) {
  return `$${n.toLocaleString()}`;
}

export default function MdfTracker({ mdfData }) {
  return (
    <Card
      title="Market Development Funds"
      headerAction={<Button size="sm">Submit Claim</Button>}
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-recast-navy">{fmt(mdfData.balance)}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Balance</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{fmt(mdfData.pending)}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{fmt(mdfData.approved)}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Approved</p>
        </div>
      </div>
      <Table columns={columns} data={mdfData.claims} />
    </Card>
  );
}
