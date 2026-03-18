'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const linkSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100),
  url: z.string().url('올바른 URL을 입력해주세요'),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkFormProps {
  initialData?: { title: string; url: string };
  onSubmit: (data: LinkFormData) => Promise<void>;
  onClose: () => void;
}

export function LinkForm({ initialData, onSubmit, onClose }: LinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: LinkFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {initialData ? '링크 수정' : '새 링크 추가'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-secondary hover:bg-surface-secondary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">제목</label>
            <input
              {...register('title')}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
              placeholder="링크 제목"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">URL</label>
            <input
              {...register('url')}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-light/30"
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-danger">{errors.url.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-3 font-medium transition hover:bg-surface-secondary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
