'use client';

interface LinkData {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface PhonePreviewProps {
  title?: string;
  bio?: string;
  links: LinkData[];
}

export function PhonePreview({ title, bio, links }: PhonePreviewProps) {
  const activeLinks = links.filter((l) => l.isActive);

  return (
    <div className="flex justify-center">
      <div className="relative w-[320px] rounded-[3rem] border-[8px] border-gray-800 bg-white p-4 shadow-xl">
        <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-gray-800" />

        <div className="mt-8 flex flex-col items-center px-4 py-6">
          <div className="mb-3 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary-dark" />

          <h2 className="text-lg font-bold text-gray-900">
            {title || 'My Page'}
          </h2>

          {bio && (
            <p className="mt-1 text-center text-sm text-gray-500">{bio}</p>
          )}

          <div className="mt-6 w-full space-y-3">
            {activeLinks.length > 0 ? (
              activeLinks.map((link) => (
                <div
                  key={link.id}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                >
                  {link.title}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400">
                링크를 추가해보세요
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
