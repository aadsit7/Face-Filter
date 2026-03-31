import { useState, useMemo } from 'react';
import Badge from '../ui/Badge';
import StatusPill from '../ui/StatusPill';

const filterTabs = ['All', 'open', 'in_progress', 'resolved'];

const filterLabels = {
  All: 'All',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

const categoryVariant = {
  deal_support: 'info',
  technical: 'purple',
  billing: 'warning',
  general: 'default',
};

const categoryLabel = {
  deal_support: 'Deal Support',
  technical: 'Technical',
  billing: 'Billing',
  general: 'General',
};

const priorityVariant = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

export default function TicketList({ tickets, onSelectTicket }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return tickets;
    return tickets.filter((t) => t.status === activeFilter);
  }, [tickets, activeFilter]);

  return (
    <div>
      <div className="flex gap-1 bg-recast-gray-100 rounded-lg p-1 mb-4 w-fit">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === tab
                ? 'bg-white text-recast-navy shadow-sm'
                : 'text-recast-gray-600 hover:text-recast-navy'
            }`}
          >
            {filterLabels[tab]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-recast-gray-500 py-8 text-center">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket?.(ticket)}
              className="border border-recast-gray-200 rounded-lg p-4 bg-white hover:bg-recast-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-recast-navy">{ticket.subject}</h4>
                <StatusPill status={ticket.status} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={categoryVariant[ticket.category]} size="sm">
                  {categoryLabel[ticket.category] || ticket.category}
                </Badge>
                <Badge variant={priorityVariant[ticket.priority]} size="sm">
                  {ticket.priority}
                </Badge>
                <span className="text-xs text-recast-gray-400 ml-auto">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
