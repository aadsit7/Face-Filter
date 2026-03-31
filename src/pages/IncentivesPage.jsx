import { useAuth } from '../context/AuthContext';
import { tiers, mdfData, rebateData, leaderboard } from '../data/mockIncentives';
import TierOverview from '../components/incentives/TierOverview';
import MdfTracker from '../components/incentives/MdfTracker';
import RebateTable from '../components/incentives/RebateTable';
import Leaderboard from '../components/incentives/Leaderboard';

export default function IncentivesPage() {
  const { user } = useAuth();
  const currentTier = user?.tier || 'Gold';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Incentives &amp; Rewards</h1>
        <p className="text-sm text-recast-gray-500 mt-1">
          Track your tier progression, MDF funds, rebates, and partner rankings
        </p>
      </div>

      <TierOverview tiers={tiers} currentTier={currentTier} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MdfTracker mdfData={mdfData} />
        <RebateTable rebateData={rebateData} />
      </div>

      <Leaderboard leaderboard={leaderboard} currentCompany={user?.company} />
    </div>
  );
}
