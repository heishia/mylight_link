'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

const registerSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(32, '비밀번호는 32자 이하여야 합니다'),
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(30, '이름은 30자 이하여야 합니다'),
  slug: z
    .string()
    .min(3, 'URL은 3자 이상이어야 합니다')
    .max(30, 'URL은 30자 이하여야 합니다')
    .regex(
      /^[a-z0-9_-]+$/,
      '영문 소문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다',
    ),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const slugValue = watch('slug');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await registerUser(data.email, data.password, data.name, data.slug);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || '회원가입에 실패했습니다';
      setError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary px-4">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">MyLight Link</h1>
          <p className="mt-2 text-text-secondary">새 계정을 만들어보세요</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">이름</label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">이메일</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
              placeholder="8자 이상"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              나만의 URL
            </label>
            <div className="flex items-center rounded-lg border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light/30">
              <span className="pl-4 text-text-secondary">mylight.link/</span>
              <input
                type="text"
                {...register('slug')}
                className="w-full rounded-r-lg px-1 py-3 outline-none"
                placeholder="my-page"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-danger">{errors.slug.message}</p>
            )}
            {slugValue && !errors.slug && (
              <p className="mt-1 text-sm text-text-secondary">
                mylight.link/{slugValue}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            {isSubmitting ? '가입 중...' : '무료로 시작하기'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
