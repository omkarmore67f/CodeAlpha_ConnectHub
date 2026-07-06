import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="panel grid place-items-center px-6 py-12 text-center">
      <Icon className="mb-4 h-9 w-9 text-marine" />
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-stone-600">{body}</p>
    </div>
  );
}
