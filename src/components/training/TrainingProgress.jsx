import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

export default function TrainingProgress({ completedModuleIds, learningPaths, certifications }) {
  const allModules = learningPaths.flatMap((p) => p.modules);
  const totalModules = allModules.length;
  const completedCount = allModules.filter((m) => completedModuleIds.includes(m.id)).length;
  const overallPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const pathsStarted = learningPaths.filter((p) =>
    p.modules.some((m) => completedModuleIds.includes(m.id))
  ).length;

  const certsEarned = certifications.filter((c) => c.status === 'earned').length;

  return (
    <Card title="Training Progress">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-recast-gray-600">Overall Completion</span>
          <span className="text-sm font-semibold text-recast-navy">
            {completedCount} / {totalModules} modules
          </span>
        </div>
        <ProgressBar value={overallPercent} color="green" showLabel />
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-recast-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-recast-navy">{pathsStarted}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Paths Started</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-recast-navy">{completedCount}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Modules Completed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-recast-navy">{certsEarned}</p>
          <p className="text-xs text-recast-gray-500 mt-1">Certs Earned</p>
        </div>
      </div>
    </Card>
  );
}
