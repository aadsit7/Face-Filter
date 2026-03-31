import Card from '../ui/Card';
import Badge from '../ui/Badge';

const productColors = {
  'Right Click Tools': 'info',
  'Application Workspace': 'purple',
  'Privileged Access': 'warning',
};

export default function PlaybookList({ playbooks, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {playbooks.map((playbook) => (
        <div
          key={playbook.id}
          onClick={() => onSelect(playbook.id)}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <div className="space-y-3">
              <Badge variant={productColors[playbook.product] || 'default'} size="sm">
                {playbook.product}
              </Badge>
              <h3 className="text-lg font-semibold text-recast-navy">
                {playbook.title}
              </h3>
              <p className="text-sm text-recast-gray-600 line-clamp-2">
                {playbook.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {playbook.targetPersonas.slice(0, 3).map((persona, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {persona}
                  </Badge>
                ))}
                {playbook.targetPersonas.length > 3 && (
                  <Badge variant="default" size="sm">
                    +{playbook.targetPersonas.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
