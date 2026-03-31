import Card from '../ui/Card';

const trophyColors = ['#F59E0B', '#9CA3AF', '#CD7F32'];

export default function Leaderboard({ leaderboard, currentCompany }) {
  return (
    <Card title="Top Partners">
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-2 text-xs text-recast-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: trophyColors[0] }} />
            Gold
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: trophyColors[1] }} />
            Silver
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: trophyColors[2] }} />
            Bronze
          </span>
        </div>

        <div className="space-y-3">
          {leaderboard.map((entry, idx) => {
            const isCurrentUser = entry.company === currentCompany;
            const widthPercent = Math.min(
              100,
              (entry.revenue / leaderboard[0].revenue) * 100
            );

            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  isCurrentUser ? 'bg-recast-navy/5 ring-1 ring-recast-navy/20' : ''
                }`}
              >
                <span className="w-6 text-center text-sm font-bold text-recast-gray-500">
                  {idx < 3 ? (
                    <span style={{ color: trophyColors[idx] }} className="text-lg">
                      &#9679;
                    </span>
                  ) : (
                    entry.rank
                  )}
                </span>
                <span
                  className={`text-sm w-40 shrink-0 truncate ${
                    isCurrentUser ? 'font-bold text-recast-navy' : 'text-recast-gray-600'
                  }`}
                >
                  {entry.company}
                  {isCurrentUser && (
                    <span className="ml-1 text-xs text-recast-gray-400">(You)</span>
                  )}
                </span>
                <div className="flex-1 bg-recast-gray-200 rounded-full h-6">
                  <div
                    className="h-6 rounded-full transition-all"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor:
                        idx < 3 ? trophyColors[idx] : isCurrentUser ? '#1e3a5f' : '#6B7280',
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-recast-gray-700 w-20 text-right tabular-nums">
                  ${(entry.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
