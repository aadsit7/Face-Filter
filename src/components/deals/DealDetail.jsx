import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import StatusPill from '../ui/StatusPill';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const statuses = ['submitted', 'approved', 'in_progress', 'won', 'lost'];

export default function DealDetail({ deal, onClose, onUpdate }) {
  const [status, setStatus] = useState(deal?.status || 'submitted');

  if (!deal) return null;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onUpdate(deal.id, { status: newStatus });
  };

  return (
    <Modal isOpen={!!deal} onClose={onClose} title="Deal Details" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Customer Name</p>
          <p className="text-sm font-medium text-recast-navy mt-1">{deal.customerName}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Contact Email</p>
          <p className="text-sm text-recast-gray-700 mt-1">{deal.customerEmail || deal.customerContact || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Product</p>
          <p className="text-sm text-recast-gray-700 mt-1">{deal.product}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Estimated Value</p>
          <p className="text-sm font-semibold text-recast-gray-700 mt-1">{formatCurrency(deal.estimatedValue)}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Expected Close Date</p>
          <p className="text-sm text-recast-gray-700 mt-1">{formatDate(deal.expectedCloseDate)}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2 mt-1">
            <StatusPill status={status} />
          </div>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Created</p>
          <p className="text-sm text-recast-gray-700 mt-1">{formatDate(deal.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Last Updated</p>
          <p className="text-sm text-recast-gray-700 mt-1">{formatDate(deal.updatedAt)}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-recast-gray-500 uppercase tracking-wider">Notes</p>
          <p className="text-sm text-recast-gray-700 mt-1">{deal.notes || 'No notes'}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-recast-gray-200">
        <label className="block text-sm font-medium text-recast-gray-700 mb-2">
          Update Status
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-lg border border-recast-gray-300 px-3 py-2 text-sm text-recast-gray-700 focus:outline-none focus:ring-2 focus:ring-recast-navy transition-colors"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
