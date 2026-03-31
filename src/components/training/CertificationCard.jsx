import Card from '../ui/Card';
import StatusPill from '../ui/StatusPill';
import ProgressBar from '../ui/ProgressBar';

export default function CertificationCard({ certification, completedModuleIds, learningPaths }) {
  const linkedPath = learningPaths.find((p) => p.id === certification.pathId);
  const isEarned = certification.status === 'earned';

  let percent = 0;
  if (linkedPath) {
    const total = linkedPath.modules.length;
    const completed = linkedPath.modules.filter((m) => completedModuleIds.includes(m.id)).length;
    percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-base font-semibold text-recast-navy pr-4">{certification.title}</h4>
        <StatusPill status={certification.status} />
      </div>
      <p className="text-sm text-recast-gray-500 mb-3">{certification.description}</p>
      {linkedPath && (
        <p className="text-xs text-recast-gray-400 mb-3">
          Path: {linkedPath.title}
        </p>
      )}
      {isEarned ? (
        <div className="flex items-center gap-2 text-green-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">
            Earned on {new Date(certification.earnedDate).toLocaleDateString()}
          </span>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-recast-gray-500">Progress</span>
            <span className="text-xs font-medium text-recast-gray-600">{percent}%</span>
          </div>
          <ProgressBar value={percent} color="cyan" size="sm" />
        </div>
      )}
    </Card>
  );
}
