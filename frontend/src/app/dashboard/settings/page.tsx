'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';

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

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    api.get('/pages/me').then(({ data }) => {
      reset({
        title: data.title || '',
        bio: data.bio || '',
        slug: data.slug,
      });
    });
  }, [reset]);

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
            <div className="flex items-center rounded-lg border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light/30">
              <span className="pl-4 text-text-secondary">mylight.link/</span>
              <input
                {...register('slug')}
                className="w-full rounded-r-lg px-1 py-3 outline-none"
                placeholder="my-page"
              />
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
