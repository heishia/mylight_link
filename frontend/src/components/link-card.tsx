'use client';

import { GripVertical, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  position: number;
}

interface LinkCardProps {
  link: LinkData;
  onEdit: (link: LinkData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function LinkCard({ link, onEdit, onDelete, onToggle }: LinkCardProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-surface p-4 transition',
        link.isActive ? 'border-border' : 'border-border/50 opacity-60',
      )}
    >
      <div className="cursor-grab text-text-secondary hover:text-text">
        <GripVertical size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{link.title}</h3>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary truncate"
        >
          {link.url}
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex items-center gap-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={link.isActive}
            onChange={() => onToggle(link.id, !link.isActive)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
        </label>

        <button
          onClick={() => onEdit(link)}
          className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-secondary hover:text-text"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(link.id)}
          className="rounded-lg p-2 text-text-secondary transition hover:bg-red-50 hover:text-danger"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
