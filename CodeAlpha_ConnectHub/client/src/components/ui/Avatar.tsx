import type { User } from '../../types';

export function Avatar({ user, size = 'md' }: { user?: Partial<User> | null; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-24 w-24 text-3xl' };
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  if (user?.avatar?.url) {
    return <img className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} src={user.avatar.url} alt={user.name || 'User'} />;
  }

  return (
    <div className={`${sizes[size]} grid place-items-center rounded-full bg-moss text-white ring-2 ring-white`}>
      <span className="font-bold">{initials || 'CH'}</span>
    </div>
  );
}
