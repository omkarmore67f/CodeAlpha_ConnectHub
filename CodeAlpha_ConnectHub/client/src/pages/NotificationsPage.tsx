import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { notificationApi } from '../api/queries';
import { Avatar } from '../components/ui/Avatar';
import { EmptyState } from '../components/ui/EmptyState';
import { timeAgo } from '../utils/time';

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['notifications'], queryFn: async () => (await notificationApi.list()).data.notifications });
  const read = useMutation({ mutationFn: notificationApi.read, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }) });
  const labels = { like: 'liked your post', comment: 'commented on your post', follow: 'followed you', mention: 'mentioned you', bookmark: 'bookmarked your post' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-ink">Notifications</h1>
        <button onClick={() => read.mutate()} className="secondary-button">Mark read</button>
      </div>
      {data?.length ? data.map((item) => (
        <div key={item._id} className={`panel flex gap-3 p-4 ${item.isRead ? '' : 'border-moss/40 bg-moss/5'}`}>
          <Avatar user={item.actor} />
          <div>
            <div className="text-sm text-stone-700"><span className="font-bold text-ink">{item.actor.name}</span> {labels[item.type]}</div>
            <div className="mt-1 text-xs text-stone-500">{timeAgo(item.createdAt)}</div>
          </div>
        </div>
      )) : <EmptyState icon={Bell} title="Quiet for now" body="Likes, comments, follows, and mentions will appear here." />}
    </div>
  );
}
