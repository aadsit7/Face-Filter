import Badge from '../ui/Badge';
import Button from '../ui/Button';

const typeBadgeVariant = {
  video: 'info',
  reading: 'default',
  quiz: 'purple',
};

export default function ModuleList({ path, completedModuleIds, onToggleComplete, onBack }) {
  const sortedModules = [...path.modules].sort((a, b) => a.order - b.order);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Learning Paths
        </span>
      </Button>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-recast-navy">{path.title}</h3>
        <p className="text-sm text-recast-gray-500 mt-1">{path.description}</p>
      </div>

      <div className="space-y-3">
        {sortedModules.map((mod) => {
          const isCompleted = completedModuleIds.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                isCompleted
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-recast-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => onToggleComplete(mod.id)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-recast-gray-300 hover:border-recast-navy'
                }`}
              >
                {isCompleted && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`text-sm font-semibold ${
                      isCompleted ? 'text-recast-gray-400 line-through' : 'text-recast-navy'
                    }`}
                  >
                    {mod.title}
                  </h4>
                  <Badge variant={typeBadgeVariant[mod.type] || 'default'} size="sm">
                    {mod.type}
                  </Badge>
                </div>
                <p
                  className={`text-sm ${
                    isCompleted ? 'text-recast-gray-400' : 'text-recast-gray-500'
                  }`}
                >
                  {mod.description}
                </p>
                <p className="text-xs text-recast-gray-400 mt-1">{mod.durationMinutes} min</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
