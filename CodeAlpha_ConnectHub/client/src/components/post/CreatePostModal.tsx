import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Send, X } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { postApi } from '../../api/queries';

export function CreatePostModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('content', content);
      files.forEach((file) => form.append('images', file));
      return (await postApi.create(form)).data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      setContent('');
      setFiles([]);
      onClose();
      toast.success('Post published');
    },
    onError: (error) => toast.error(error.message)
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-4">
      <form onSubmit={submit} className="w-full max-w-xl rounded-t-3xl border border-line bg-paper p-5 shadow-soft sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-ink">Create post</h2>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-36 w-full resize-none rounded-2xl border-line bg-white p-4 text-base focus:border-ink focus:ring-2 focus:ring-ink/10"
          placeholder="What are you building, learning, or thinking about?"
          maxLength={1200}
        />
        {files.length > 0 && <div className="mt-2 text-sm font-medium text-stone-600">{files.length} image{files.length > 1 ? 's' : ''} selected</div>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 6))}
        />
        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={() => inputRef.current?.click()} className="secondary-button">
            <ImagePlus className="h-4 w-4" />
            Images
          </button>
          <button disabled={mutation.isPending || (!content.trim() && files.length === 0)} className="primary-button">
            <Send className="h-4 w-4" />
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
