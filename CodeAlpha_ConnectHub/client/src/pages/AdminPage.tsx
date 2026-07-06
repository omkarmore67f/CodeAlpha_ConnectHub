import { useQuery } from '@tanstack/react-query';
import { BarChart3, FileText, Users } from 'lucide-react';
import { adminApi } from '../api/queries';
import { EmptyState } from '../components/ui/EmptyState';

export function AdminPage() {
  const { data: metrics } = useQuery({ queryKey: ['admin-metrics'], queryFn: async () => (await adminApi.dashboard()).data.metrics });
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: async () => (await adminApi.users()).data.users });
  const { data: posts } = useQuery({ queryKey: ['admin-posts'], queryFn: async () => (await adminApi.posts()).data.posts });

  if (!metrics) return <EmptyState icon={BarChart3} title="Admin data unavailable" body="Admin metrics load after signing in with an admin account." />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-ink">Admin Dashboard</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="panel p-4">
            <div className="text-sm font-bold uppercase text-stone-500">{key}</div>
            <div className="mt-2 text-3xl font-black text-ink">{value}</div>
          </div>
        ))}
      </div>
      <section className="panel p-4">
        <h2 className="mb-3 flex items-center gap-2 font-black text-ink"><Users className="h-5 w-5" />Manage Users</h2>
        <div className="divide-y divide-line">
          {users?.slice(0, 8).map((user) => <div key={user._id} className="flex justify-between py-3 text-sm"><span className="font-bold">{user.name}</span><span className="text-stone-500">@{user.username}</span></div>)}
        </div>
      </section>
      <section className="panel p-4">
        <h2 className="mb-3 flex items-center gap-2 font-black text-ink"><FileText className="h-5 w-5" />Manage Posts</h2>
        <div className="divide-y divide-line">
          {posts?.slice(0, 8).map((post) => <div key={post._id} className="py-3 text-sm text-stone-700">{post.content || 'Image post'}</div>)}
        </div>
      </section>
    </div>
  );
}
