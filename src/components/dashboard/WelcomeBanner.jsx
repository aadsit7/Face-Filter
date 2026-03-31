import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

const tierVariant = {
  Gold: 'warning',
  Silver: 'default',
  Platinum: 'purple',
};

export default function WelcomeBanner() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-recast-navy to-recast-navy-light p-8">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-24 bottom-[-2rem] h-32 w-32 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute left-1/2 -top-6 h-24 w-24 rounded-full bg-recast-cyan/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-white/70">
            {user?.company} | {user?.tier} Partner
          </p>
        </div>

        <Badge variant={tierVariant[user?.tier] || 'default'} size="md">
          {user?.tier} Partner
        </Badge>
      </div>
    </div>
  );
}
