import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

export default function LearningPaths({ paths, completedModuleIds, onSelectPath }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {paths.map((path) => {
        const total = path.modules.length;
        const completed = path.modules.filter((m) => completedModuleIds.includes(m.id)).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        const started = completed > 0;

        return (
          <Card key={path.id}>
            <h4 className="text-lg font-semibold text-recast-navy mb-2">{path.title}</h4>
            <p className="text-sm text-recast-gray-500 mb-4 line-clamp-2">{path.description}</p>
            <p className="text-xs text-recast-gray-400 mb-3">{total} modules</p>
            <div className="mb-4">
              <ProgressBar value={percent} color="green" showLabel />
            </div>
            <Button
              variant={started ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onSelectPath(path)}
              className="w-full"
            >
              {started ? 'Continue' : 'Start'}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
