'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import api from '@/lib/api';
import { LinkCard } from '@/components/link-card';
import { LinkForm } from '@/components/link-form';
import { PhonePreview } from '@/components/phone-preview';

interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
}

interface PageData {
  title: string;
  bio: string;
  slug: string;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [page, setPage] = useState<PageData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [linksRes, pageRes] = await Promise.all([
        api.get<LinkData[]>('/links'),
        api.get<PageData>('/pages/me'),
      ]);
      setLinks(linksRes.data);
      setPage(pageRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (data: { title: string; url: string }) => {
    await api.post('/links', data);
    fetchData();
  };

  const handleUpdate = async (data: { title: string; url: string }) => {
    if (!editingLink) return;
    await api.patch(`/links/${editingLink.id}`, data);
    setEditingLink(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('이 링크를 삭제하시겠습니까?')) return;
    await api.delete(`/links/${id}`);
    fetchData();
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await api.patch(`/links/${id}`, { isActive });
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">링크 관리</h1>
            <p className="mt-1 text-text-secondary">
              링크를 추가하고 순서를 변경하세요
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
          >
            <Plus size={18} />
            링크 추가
          </button>
        </div>

        <div className="space-y-3">
          {links.length > 0 ? (
            links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={(l) => setEditingLink(l)}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-text-secondary">
                아직 링크가 없습니다. 첫 번째 링크를 추가해보세요!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                링크 추가하기
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden w-[360px] shrink-0 xl:block">
        <div className="sticky top-8">
          <h2 className="mb-4 text-center text-sm font-medium text-text-secondary">
            미리보기
          </h2>
          <PhonePreview
            title={page?.title || ''}
            bio={page?.bio || ''}
            links={links}
          />
        </div>
      </div>

      {showForm && (
        <LinkForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {editingLink && (
        <LinkForm
          initialData={{ title: editingLink.title, url: editingLink.url }}
          onSubmit={handleUpdate}
          onClose={() => setEditingLink(null)}
        />
      )}
    </div>
  );
}
