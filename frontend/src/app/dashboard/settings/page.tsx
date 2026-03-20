'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Copy, Check, Camera, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:4000';

const settingsSchema = z.object({
  title: z.string().max(50).optional(),
  bio: z.string().max(200).optional(),
  slug: z
    .string()
    .min(3, 'URL은 3자 이상이어야 합니다')
    .max(30)
    .regex(
      /^[a-z0-9_-]+$/,
      '영문 소문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다',
    ),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : 'http://localhost:3000/';

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  const slugValue = useWatch({ control, name: 'slug' });

  const handleCopyUrl = async () => {
    if (!slugValue) return;
    await navigator.clipboard.writeText(`${BASE_URL}${slugValue}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    api.get('/pages/me').then(({ data }) => {
      reset({
        title: data.title || '',
        bio: data.bio || '',
        slug: data.slug,
      });
      setAvatarUrl(data.avatarUrl || null);
      setPageTitle(data.title || '');
    });
  }, [reset]);

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('JPG, PNG, WebP, GIF 파일만 업로드 가능합니다');
      return;
    }

    try {
      setError('');
      setAvatarUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/pages/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatarUrl(data.avatarUrl);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || '프로필 사진 업로드에 실패했습니다';
      setError(message);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setError('');
      setAvatarUploading(true);
      await api.delete('/pages/me/avatar');
      setAvatarUrl(null);
    } catch {
      setError('프로필 사진 삭제에 실패했습니다');
    } finally {
      setAvatarUploading(false);
    }
  };

  const onSubmit = async (data: SettingsForm) => {
    try {
      setError('');
      setSuccess(false);
      await api.patch('/pages/me', data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || '설정 저장에 실패했습니다';
      setError(message);
    }
  };

  const getAvatarSrc = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url}`;
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold">페이지 설정</h1>
      <p className="mb-8 text-text-secondary">
        프로필과 페이지 URL을 설정하세요
      </p>

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-success">
          설정이 저장되었습니다
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold">프로필 사진</h2>

        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={getAvatarSrc(avatarUrl)}
                alt="프로필 사진"
                className="h-24 w-24 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white shadow-md">
                {pageTitle ? pageTitle.charAt(0).toUpperCase() : '?'}
              </div>
            )}

            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Loader2 size={24} className="animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50"
            >
              <Camera size={16} />
              사진 변경
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleAvatarRemove}
                disabled={avatarUploading}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-danger transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
                사진 삭제
              </button>
            )}

            <p className="text-xs text-text-secondary">
              JPG, PNG, WebP, GIF · 최대 5MB
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">프로필 정보</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                페이지 제목
              </label>
              <input
                {...register('title')}
                className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
                placeholder="나의 링크 페이지"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">소개</label>
              <textarea
                {...register('bio')}
                rows={3}
                className="w-full resize-none rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
                placeholder="간단한 자기소개를 작성해보세요"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-danger">
                  {errors.bio.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">페이지 URL</h2>

          <div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light/30">
                <span className="shrink-0 pl-4 text-text-secondary">
                  {BASE_URL}
                </span>
                <input
                  {...register('slug')}
                  className="w-full rounded-r-lg px-1 py-3 outline-none"
                  placeholder="my-page"
                />
              </div>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg border border-border bg-surface transition hover:bg-gray-100"
                title="URL 복사"
              >
                {copied ? (
                  <Check size={18} className="text-success" />
                ) : (
                  <Copy size={18} className="text-text-secondary" />
                )}
              </button>
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-danger">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : '설정 저장'}
        </button>
      </form>
    </div>
  );
}
