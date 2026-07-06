import { api } from './client';
import type { Comment, Notification, Post, User } from '../types';

export const authApi = {
  register: (payload: Record<string, string>) => api.post<{ token: string; user: User }>('/auth/register', payload),
  login: (payload: Record<string, string>) => api.post<{ token: string; user: User }>('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<{ user: User }>('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  changePassword: (payload: Record<string, string>) => api.patch<{ token: string; user: User }>('/auth/change-password', payload)
};

export const postApi = {
  feed: (mode = 'latest', page = 1) => api.get<{ posts: Post[]; nextPage: number | null }>(`/posts/feed?mode=${mode}&page=${page}`),
  trending: () => api.get<{ topics: { tag: string; posts: number }[] }>('/posts/trending'),
  bookmarks: () => api.get<{ posts: Post[] }>('/posts/bookmarks'),
  create: (form: FormData) => api.post<{ post: Post }>('/posts', form),
  update: (id: string, payload: Pick<Post, 'content' | 'visibility'>) => api.patch<{ post: Post }>(`/posts/${id}`, payload),
  remove: (id: string) => api.delete(`/posts/${id}`),
  like: (id: string) => api.post<{ liked: boolean }>(`/posts/${id}/like`),
  bookmark: (id: string) => api.post<{ bookmarked: boolean }>(`/posts/${id}/bookmark`),
  share: (id: string) => api.post<{ shareCount: number }>(`/posts/${id}/share`)
};

export const commentApi = {
  list: (postId: string) => api.get<{ comments: Comment[] }>(`/comments/post/${postId}`),
  create: (postId: string, payload: { content: string; parent?: string }) =>
    api.post<{ comment: Comment }>(`/comments/post/${postId}`, payload),
  update: (id: string, content: string) => api.patch<{ comment: Comment }>(`/comments/${id}`, { content }),
  remove: (id: string) => api.delete(`/comments/${id}`),
  like: (id: string) => api.post<{ liked: boolean }>(`/comments/${id}/like`)
};

export const userApi = {
  profile: (username: string) => api.get<{ user: User }>(`/users/${username}`),
  update: (form: FormData) => api.patch<{ user: User }>('/users/me', form),
  follow: (id: string) => api.post(`/users/${id}/follow`),
  unfollow: (id: string) => api.delete(`/users/${id}/follow`),
  suggested: () => api.get<{ users: User[] }>('/users/suggested'),
  search: (q: string) => api.get<{ users: User[]; posts: Post[]; hashtags: { tag: string; count: number }[] }>(`/users/search?q=${encodeURIComponent(q)}`),
  deleteAccount: () => api.delete('/users/me')
};

export const notificationApi = {
  list: () => api.get<{ notifications: Notification[] }>('/notifications'),
  read: () => api.patch('/notifications/read')
};

export const adminApi = {
  dashboard: () => api.get<{ metrics: Record<string, number> }>('/admin/dashboard'),
  users: () => api.get<{ users: User[] }>('/admin/users'),
  posts: () => api.get<{ posts: Post[] }>('/admin/posts')
};
