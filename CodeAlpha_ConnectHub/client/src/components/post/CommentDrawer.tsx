import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Send, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { commentApi } from '../../api/queries';
import type { Comment } from '../../types';
import { timeAgo } from '../../utils/time';
import { Avatar } from '../ui/Avatar';
import { SkeletonFeed } from '../ui/Skeleton';

function CommentRow({ comment, postId }: { comment: Comment; postId: string }) {
  const queryClient = useQueryClient();
  const like = useMutation({
    mutationFn: () => commentApi.like(comment._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', postId] })
  });

  return (
    <div className="flex gap-3">
      <Avatar user={comment.author} size="sm" />
      <div className="flex-1 rounded-2xl bg-stone-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-bold text-ink">{comment.author.name}</span>
            <span className="ml-2 text-xs text-stone-500">{timeAgo(comment.createdAt)}</span>
          </div>
          <button onClick={() => like.mutate()} className={`icon-button h-8 w-8 ${comment.liked ? 'text-ember' : ''}`} aria-label="Like comment">
            <Heart className="h-4 w-4" fill={comment.liked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="mt-1 text-sm leading-6 text-stone-700">{comment.content}</p>
        {comment.replies?.map((reply) => (
          <div key={reply._id} className="mt-3 border-l border-line pl-3">
            <CommentRow comment={reply} postId={postId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommentDrawer({ postId, open, onClose }: { postId: string; open: boolean; onClose: () => void }) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => (await commentApi.list(postId)).data.comments,
    enabled: open
  });
  const create = useMutation({
    mutationFn: () => commentApi.create(postId, { content }),
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error) => toast.error(error.message)
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (content.trim()) create.mutate();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/35 backdrop-blur-sm sm:place-items-center">
      <section className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl border border-line bg-paper shadow-soft sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line p-4">
          <div className="flex items-center gap-2 font-black text-ink">
            <MessageCircle className="h-5 w-5" />
            Conversation
          </div>
          <button onClick={onClose} className="icon-button" aria-label="Close comments">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {isLoading ? <SkeletonFeed /> : data?.map((comment) => <CommentRow key={comment._id} comment={comment} postId={postId} />)}
        </div>
        <form onSubmit={submit} className="flex gap-2 border-t border-line p-4">
          <input value={content} onChange={(event) => setContent(event.target.value)} className="input" placeholder="Add a thoughtful reply" />
          <button disabled={create.isPending || !content.trim()} className="primary-button px-4" aria-label="Send comment">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
