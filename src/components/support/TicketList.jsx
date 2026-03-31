import { useState } from 'react'
import StatusPill from '../ui/StatusPill'
import Badge from '../ui/Badge'

const filters = ['all', 'open', 'in_progress', 'resolved']

export default function TicketList({ tickets, onSelectTicket }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all' ? tickets : tickets.filter((t) => t.status === activeFilter)

  const priorityVariant = { low: 'default', medium: 'warning', high: 'danger' }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === f ? 'bg-recast-navy text-white' : 'bg-recast-gray-100 text-recast-gray-600 hover:bg-recast-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-recast-gray-400 py-8">No tickets found</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket?.(ticket)}
              className="p-4 border border-recast-gray-200 rounded-lg hover:border-recast-navy/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-recast-gray-800 truncate">{ticket.subject}</h4>
                  <p className="text-sm text-recast-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                </div>
                <StatusPill status={ticket.status} />
              </div>
              <div className="flex gap-3 mt-3">
                <Badge variant={priorityVariant[ticket.priority]} size="sm">{ticket.priority}</Badge>
                <Badge size="sm">{ticket.category.replace(/_/g, ' ')}</Badge>
                <span className="text-xs text-recast-gray-400 ml-auto">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
