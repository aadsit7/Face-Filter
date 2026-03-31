import Badge from '../ui/Badge';

const tierColors = {
  Registered: {
    border: 'border-gray-400',
    bg: 'bg-gray-50',
    badge: 'default',
    ring: 'ring-gray-300',
  },
  Silver: {
    border: 'border-slate-400',
    bg: 'bg-slate-50',
    badge: 'default',
    ring: 'ring-slate-300',
  },
  Gold: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    badge: 'warning',
    ring: 'ring-amber-300',
  },
  Platinum: {
    border: 'border-purple-400',
    bg: 'bg-purple-50',
    badge: 'purple',
    ring: 'ring-purple-300',
  },
};

const tierOrder = ['Registered', 'Silver', 'Gold', 'Platinum'];

export default function TierOverview({ tiers, currentTier }) {
  const currentIndex = tierOrder.indexOf(currentTier);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-recast-gray-200 p-5">
      <h3 className="text-lg font-semibold text-recast-navy mb-4">Partner Tier Progression</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => {
          const tierIdx = tierOrder.indexOf(tier.name);
          const isCurrent = tier.name === currentTier;
          const isAbove = tierIdx > currentIndex;
          const colors = tierColors[tier.name] || tierColors.Registered;

          return (
            <div
              key={tier.id}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                isCurrent
                  ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}`
                  : 'border-recast-gray-200 bg-white'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-2.5 left-3">
                  <Badge variant={colors.badge} size="sm">
                    Current Tier
                  </Badge>
                </div>
              )}
              {isAbove && (
                <div className="absolute -top-2.5 left-3">
                  <Badge variant="info" size="sm">
                    Next Milestone
                  </Badge>
                </div>
              )}
              <div className="mt-1">
                <h4 className="text-base font-bold text-recast-navy">{tier.name}</h4>
                <p className="text-lg font-semibold text-recast-gray-700 mt-1">{tier.discount} discount</p>
                <p className="text-xs text-recast-gray-500 mt-2 leading-relaxed">{tier.requirements}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
