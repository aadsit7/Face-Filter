import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import KpiGrid from '../components/dashboard/KpiGrid';
import QuickLinks from '../components/dashboard/QuickLinks';
import RecentActivity from '../components/dashboard/RecentActivity';
import Announcements from '../components/dashboard/Announcements';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <KpiGrid />
      <QuickLinks />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <Announcements />
        </div>
      </div>
    </div>
  );
}
