import { Bell, Bookmark, Compass, Home, Plus, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function MobileNav({ onCreate }: { onCreate: () => void }) {
  const user = useAuthStore((state) => state.user);
  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { to: `/profile/${user?.username}`, icon: UserRound, label: 'Profile' }
  ];

  return (
    <>
      <button onClick={onCreate} className="fixed bottom-20 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-ember text-white shadow-soft lg:hidden">
        <Plus className="h-6 w-6" />
      </button>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-line bg-white/95 px-2 backdrop-blur lg:hidden">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} aria-label={item.label} className={({ isActive }) => `grid place-items-center ${isActive ? 'text-ink' : 'text-stone-500'}`}>
            <item.icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>
    </>
  );
}
