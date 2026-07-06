import { Bell, Bookmark, Compass, Home, Plus, Settings, Shield, UserRound, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/queries';

const baseItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function LeftSidebar({ onCreate }: { onCreate: () => void }) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const items = user?.role === 'admin' ? [...baseItems, { to: '/admin', label: 'Admin', icon: Shield }] : baseItems;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      clearSession();
      navigate('/auth');
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line px-4 py-5 lg:flex">
      <div className="mb-8 px-3">
        <div className="text-2xl font-black tracking-tight text-ink">ConnectHub</div>
        <div className="text-sm font-medium text-stone-500">Share ideas. Build communities.</div>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
                isActive ? 'bg-ink text-white' : 'text-stone-700 hover:bg-stone-100 hover:text-ink'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to={`/profile/${user?.username}`}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
              isActive ? 'bg-ink text-white' : 'text-stone-700 hover:bg-stone-100 hover:text-ink'
            }`
          }
        >
          <UserRound className="h-5 w-5" />
          Profile
        </NavLink>
      </nav>
      <div className="mt-auto space-y-4 pt-4 border-t border-line">
        <button onClick={onCreate} className="primary-button w-full">
          <Plus className="h-4 w-4" />
          Create Post
        </button>
        
        {user && (
          <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-bold text-stone-700 uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden leading-tight">
                <p className="truncate text-xs font-bold text-stone-900">{user.name}</p>
                <p className="truncate text-[10px] text-stone-500">@{user.username}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="rounded-full p-2 text-stone-500 hover:bg-stone-200 hover:text-red-600 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
