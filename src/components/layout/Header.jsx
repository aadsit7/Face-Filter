import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const routeTitles = {
  '/': 'Dashboard',
  '/playbooks': 'Sales Playbooks',
  '/products': 'Products',
  '/deals': 'Deal Registration',
  '/marketing': 'Marketing',
  '/training': 'Training',
  '/incentives': 'Incentives',
  '/support': 'Support',
};

function getPageTitle(pathname) {
  // Exact match first
  if (routeTitles[pathname]) return routeTitles[pathname];
  // Match parent route for nested paths like /playbooks/123
  const base = '/' + pathname.split('/').filter(Boolean)[0];
  return routeTitles[base] || 'Dashboard';
}

function UserInitials({ name }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <div className="w-8 h-8 rounded-full bg-recast-navy flex items-center justify-center text-white text-xs font-semibold">
      {initials}
    </div>
  );
}

export default function Header({ onMenuToggle, sidebarCollapsed }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const pageTitle = getPageTitle(pathname);

  return (
    <header
      className={`
        fixed top-0 right-0 z-30 h-16 bg-white border-b border-recast-gray-200
        flex items-center justify-between px-4 sm:px-6
        transition-all duration-300 ease-in-out
        left-0 md:left-64
        ${sidebarCollapsed ? 'md:left-16' : 'md:left-64'}
      `}
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1.5 -ml-1.5 rounded-lg text-recast-gray-600 hover:bg-recast-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-recast-gray-800">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-lg text-recast-gray-500 hover:bg-recast-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-recast-red rounded-full" />
        </button>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            <UserInitials name={user.name} />
            <span className="hidden sm:block text-sm font-medium text-recast-gray-700">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-sm text-recast-gray-500 hover:text-recast-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
