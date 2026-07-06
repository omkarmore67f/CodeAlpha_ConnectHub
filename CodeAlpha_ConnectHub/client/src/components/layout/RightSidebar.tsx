import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postApi, userApi } from '../../api/queries';
import { Avatar } from '../ui/Avatar';

export function RightSidebar() {
  const { data: trends } = useQuery({ queryKey: ['trending'], queryFn: async () => (await postApi.trending()).data.topics });
  const { data: users } = useQuery({ queryKey: ['suggested'], queryFn: async () => (await userApi.suggested()).data.users });

  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 space-y-4 overflow-y-auto border-l border-line px-4 py-5 xl:block">
      <section className="panel p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">Trending</h2>
        <div className="mt-3 space-y-3">
          {(trends || []).map((topic) => (
            <Link to={`/explore?q=${topic.tag}`} key={topic.tag} className="block rounded-lg p-2 transition hover:bg-stone-50">
              <div className="font-bold text-ink">#{topic.tag}</div>
              <div className="text-xs text-stone-500">{topic.posts} posts</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="panel p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">Who to Follow</h2>
        <div className="mt-3 space-y-3">
          {(users || []).map((user) => (
            <Link to={`/profile/${user.username}`} key={user._id} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-stone-50">
              <Avatar user={user} />
              <div className="min-w-0">
                <div className="truncate font-bold text-ink">{user.name}</div>
                <div className="truncate text-xs text-stone-500">@{user.username}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="panel p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">Latest Activity</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">Fresh likes, follows, mentions, and replies appear in Notifications as your community grows.</p>
      </section>
    </aside>
  );
}
