import { useState } from 'react';
import StatusPill from '../ui/StatusPill';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const columnDefs = [
  { key: 'customerName', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'estimatedValue', label: 'Value' },
  { key: 'expectedCloseDate', label: 'Close Date' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created' },
];

export default function DealTable({ deals, onRowClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...deals].sort((a, b) => {
    if (!sortKey) return 0;
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-recast-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-recast-gray-50">
            {columnDefs.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="text-left text-xs font-medium uppercase text-recast-gray-500 px-4 py-3 tracking-wider cursor-pointer select-none hover:text-recast-navy transition-colors"
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (
                    <svg
                      className={`w-3 h-3 transition-transform ${sortAsc ? '' : 'rotate-180'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((deal) => (
            <tr
              key={deal.id}
              onClick={() => onRowClick && onRowClick(deal)}
              className="border-b border-recast-gray-200 cursor-pointer hover:bg-recast-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-recast-navy">{deal.customerName}</td>
              <td className="px-4 py-3 text-sm text-recast-gray-700">{deal.product}</td>
              <td className="px-4 py-3 text-sm text-recast-gray-700">{formatCurrency(deal.estimatedValue)}</td>
              <td className="px-4 py-3 text-sm text-recast-gray-700">{formatDate(deal.expectedCloseDate)}</td>
              <td className="px-4 py-3">
                <StatusPill status={deal.status} />
              </td>
              <td className="px-4 py-3 text-sm text-recast-gray-500">{formatDate(deal.createdAt)}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-recast-gray-400">
                No deals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
