import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link2, MapPin, UserPlus, UserX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userApi } from '../api/queries';
import { Avatar } from '../components/ui/Avatar';
import { useAuthStore } from '../store/authStore';

export function ProfilePage() {
  const { username = '' } = useParams();
  const viewer = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['profile', username], queryFn: async () => (await userApi.profile(username)).data.user });
  const follow = useMutation({
    mutationFn: () => (data?.isFollowing ? userApi.unfollow(data._id) : userApi.follow(data!._id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', username] }),
    onError: (error) => toast.error(error.message)
  });

  if (!data) return <div className="panel h-64 animate-pulse" />;
  const isSelf = viewer?.username === data.username;

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
      <div className="h-40 bg-[linear-gradient(135deg,#24556b,#df5b3f_55%,#2f6b57)]">
        {data.coverImage?.url && <img src={data.coverImage.url} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="px-5 pb-6">
        <div className="-mt-12 flex items-end justify-between gap-4">
          <Avatar user={data} size="xl" />
          {isSelf ? (
            <a href="/settings" className="secondary-button">Edit profile</a>
          ) : (
            <button onClick={() => follow.mutate()} className="primary-button">
              {data.isFollowing ? <UserX className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {data.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-black text-ink">{data.name}</h1>
        <div className="text-sm font-semibold text-stone-500">@{data.username}</div>
        {data.bio && <p className="mt-4 max-w-xl leading-7 text-stone-700">{data.bio}</p>}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
          {data.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{data.location}</span>}
          {data.website && <a href={data.website} className="inline-flex items-center gap-1 text-marine hover:underline"><Link2 className="h-4 w-4" />{data.website}</a>}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {data.skills?.map((skill) => <span key={skill} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-bold text-stone-700">{skill}</span>)}
        </div>
        <div className="mt-6 grid grid-cols-3 rounded-2xl border border-line bg-paper text-center">
          <div className="p-4"><div className="text-xl font-black">{data.postsCount || 0}</div><div className="text-xs text-stone-500">Posts</div></div>
          <div className="border-x border-line p-4"><div className="text-xl font-black">{data.followersCount || 0}</div><div className="text-xs text-stone-500">Followers</div></div>
          <div className="p-4"><div className="text-xl font-black">{data.followingCount || 0}</div><div className="text-xs text-stone-500">Following</div></div>
        </div>
      </div>
    </div>
  );
}
