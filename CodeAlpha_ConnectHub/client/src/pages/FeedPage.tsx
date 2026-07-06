import { useInfiniteQuery } from '@tanstack/react-query';
import { Flame, Newspaper, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { postApi } from '../api/queries';
import { PostCard } from '../components/post/PostCard';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonFeed } from '../components/ui/Skeleton';

export function FeedPage() {
  const [mode, setMode] = useState('latest');
  const feed = useInfiniteQuery({
    queryKey: ['feed', mode],
    queryFn: async ({ pageParam = 1 }) => (await postApi.feed(mode, pageParam)).data,
    initialPageParam: 1,
    getNextPageParam: (last) => last.nextPage
  });
  const posts = feed.data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[24px] border border-stone-800 bg-stone-950 p-6 text-white shadow-xl sm:p-10">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32120-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-bold text-marine backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-yellow-400" />
              Welcome to ConnectHub
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Connect, Share, and Build the Future
            </h1>
            <p className="max-w-md text-sm text-stone-300 leading-relaxed sm:text-base">
              A premium, focused space designed for developers, innovators, and creators to share ideas, build strong communities, and grow together.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => {
                  const postInput = document.querySelector('textarea');
                  if (postInput) postInput.focus();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-stone-950 hover:bg-stone-150 transition-colors"
              >
                Create a Post
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setMode('trending')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                Explore Trending
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
                alt="Cyber Network Illustration"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Subtle floating glass ornament */}
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/80 backdrop-blur-md shadow-lg">
              🚀 100+ Active Members
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-ink">Home Feed</h2>
          <p className="text-sm text-stone-600">Latest ideas from your network.</p>
        </div>
        <div className="rounded-full border border-line bg-white p-1">
          {[
            ['latest', Newspaper],
            ['following', Users],
            ['trending', Flame]
          ].map(([key, Icon]) => (
            <button key={key as string} onClick={() => setMode(key as string)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold capitalize ${mode === key ? 'bg-ink text-white' : 'text-stone-600'}`}>
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{key as string}</span>
            </button>
          ))}
        </div>
      </div>
      {feed.isLoading ? <SkeletonFeed /> : posts.length ? posts.map((post) => <PostCard key={post._id} post={post} />) : <EmptyState icon={Newspaper} title="No posts yet" body="Create the first post or follow people to shape your feed." />}
      {feed.hasNextPage && <button onClick={() => feed.fetchNextPage()} className="secondary-button mx-auto flex">Load more</button>}
    </div>
  );
}
