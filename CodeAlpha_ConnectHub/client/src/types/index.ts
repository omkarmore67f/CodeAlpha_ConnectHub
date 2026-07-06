export type ImageAsset = {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
};

export type User = {
  _id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: ImageAsset;
  coverImage?: ImageAsset;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  role?: 'user' | 'admin';
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
};

export type Post = {
  _id: string;
  author: User;
  content: string;
  images: ImageAsset[];
  hashtags: string[];
  visibility: 'public' | 'followers';
  shareCount: number;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  _id: string;
  post: string;
  author: User;
  parent?: string | null;
  content: string;
  likesCount: number;
  liked: boolean;
  replies?: Comment[];
  createdAt: string;
};

export type Notification = {
  _id: string;
  actor: User;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'bookmark';
  post?: Pick<Post, '_id' | 'content' | 'images'>;
  isRead: boolean;
  createdAt: string;
};
