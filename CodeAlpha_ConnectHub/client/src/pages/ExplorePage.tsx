import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { userApi } from '../api/queries';
import { PostCard } from '../components/post/PostCard';
import { Avatar } from '../components/ui/Avatar';

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { data } = useQuery({ queryKey: ['search', q], queryFn: async () => (await userApi.search(q)).data, enabled: q.length > 1 });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-ink">Explore</h1>
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
        <input value={q} onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {})} className="input pl-12" placeholder="Search users, posts, hashtags, and names" />
      </div>
      {data?.hashtags?.length ? (
        <div className="panel flex flex-wrap gap-2 p-4">
          {data.hashtags.map((item) => <button key={item.tag} onClick={() => setParams({ q: item.tag })} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-marine">#{item.tag}</button>)}
        </div>
      ) : null}
      {data?.users?.map((user) => (
        <Link key={user._id} to={`/profile/${user.username}`} className="panel flex items-center gap-3 p-4">
          <Avatar user={user} />
          <div>
            <div className="font-bold text-ink">{user.name}</div>
            <div className="text-sm text-stone-500">@{user.username}</div>
          </div>
        </Link>
      ))}
      {data?.posts?.map((post) => <PostCard key={post._id} post={post} />)}
    </div>
  );
}
