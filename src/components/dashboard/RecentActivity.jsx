import { recentActivity } from '../../data/mockDashboard';
import Card from '../ui/Card';

const dotColors = {
  deal_registered: 'bg-recast-cyan',
  deal_approved: 'bg-recast-green',
  deal_won: 'bg-recast-green',
  certification_earned: 'bg-recast-purple',
  mdf_claim: 'bg-recast-orange',
  training_completed: 'bg-recast-purple',
  asset_downloaded: 'bg-recast-gray-400',
};

function relativeTime(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export default function RecentActivity() {
  const items = recentActivity.slice(0, 6);

  return (
    <Card title="Recent Activity">
      <ul className="space-y-4">
        {items.map((activity) => (
          <li key={activity.id} className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColors[activity.type] || 'bg-recast-gray-400'}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-recast-gray-700">{activity.message}</p>
              <p className="mt-0.5 text-xs text-recast-gray-400">
                {relativeTime(activity.timestamp)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
