import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Copy, Heart, MessageCircle, MoreHorizontal, Repeat2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { postApi } from '../../api/queries';
import { useAuthStore } from '../../store/authStore';
import type { Post } from '../../types';
import { timeAgo } from '../../utils/time';
import { Avatar } from '../ui/Avatar';
import { CommentDrawer } from './CommentDrawer';

export function PostCard({ post }: { post: Post }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['feed'] });

  const like = useMutation({ mutationFn: () => postApi.like(post._id), onSuccess: invalidate });
  const bookmark = useMutation({ mutationFn: () => postApi.bookmark(post._id), onSuccess: invalidate });
  const share = useMutation({ mutationFn: () => postApi.share(post._id), onSuccess: invalidate });
  const remove = useMutation({
    mutationFn: () => postApi.remove(post._id),
    onSuccess: () => {
      invalidate();
      toast.success('Post deleted');
    }
  });

  const canDelete = user?._id === post.author._id || user?.role === 'admin';

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${post.author.username}?post=${post._id}`);
    toast.success('Link copied');
  }

  return (
    <article className="panel p-5 transition hover:border-stone-300">
      <div className="flex gap-3">
        <Link to={`/profile/${post.author.username}`}>
          <Avatar user={post.author} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link to={`/profile/${post.author.username}`} className="font-bold text-ink hover:underline">
                {post.author.name}
              </Link>
              <div className="text-sm text-stone-500">@{post.author.username} · {timeAgo(post.createdAt)}</div>
            </div>
            {canDelete ? (
              <button onClick={() => remove.mutate()} className="icon-button h-9 w-9" aria-label="Delete post">
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <MoreHorizontal className="h-5 w-5 text-stone-400" />
            )}
          </div>
          <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-7 text-stone-800">{post.content}</p>
          {post.images?.length > 0 && (
            <div className={`mt-4 grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.images.map((image) => (
                <img key={image.url} src={image.url} alt="" className="max-h-[420px] w-full rounded-2xl border border-line object-cover" />
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-stone-500">
            <button onClick={() => like.mutate()} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-stone-100 ${post.liked ? 'text-ember' : ''}`}>
              <Heart className="h-4 w-4" fill={post.liked ? 'currentColor' : 'none'} />
              {post.likesCount}
            </button>
            <button onClick={() => setCommentsOpen(true)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-stone-100">
              <MessageCircle className="h-4 w-4" />
              {post.commentsCount}
            </button>
            <button onClick={() => share.mutate()} className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-stone-100">
              <Repeat2 className="h-4 w-4" />
              {post.shareCount}
            </button>
            <button onClick={() => bookmark.mutate()} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-stone-100 ${post.bookmarked ? 'text-moss' : ''}`}>
              <Bookmark className="h-4 w-4" fill={post.bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-stone-100">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <CommentDrawer postId={post._id} open={commentsOpen} onClose={() => setCommentsOpen(false)} />
    </article>
  );
}
