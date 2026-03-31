import { announcements } from '../../data/mockDashboard';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function Announcements() {
  return (
    <Card title="Announcements">
      <div className="divide-y divide-recast-gray-200">
        {announcements.map((item, index) => (
          <div key={item.id} className={index === 0 ? 'pb-4' : 'py-4 last:pb-0'}>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-recast-navy">{item.title}</h4>
              {index === 0 && <Badge variant="info" size="sm">New</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-recast-gray-400">{item.date}</p>
            <p className="mt-1.5 text-sm text-recast-gray-600 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
