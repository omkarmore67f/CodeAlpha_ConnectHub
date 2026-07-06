import { useQuery } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { postApi } from '../api/queries';
import { PostCard } from '../components/post/PostCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonFeed } from '../components/ui/Skeleton';

export function BookmarksPage() {
  const { data, isLoading } = useQuery({ queryKey: ['bookmarks'], queryFn: async () => (await postApi.bookmarks()).data.posts });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-ink">Bookmarks</h1>
      {isLoading ? <SkeletonFeed /> : data?.length ? data.map((post) => <PostCard key={post._id} post={post} />) : <EmptyState icon={Bookmark} title="Nothing saved" body="Bookmark posts to build a private reading queue." />}
    </div>
  );
}
