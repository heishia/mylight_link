import { notFound } from 'next/navigation';

interface PageData {
  id: string;
  slug: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  userName: string;
  links: {
    id: string;
    title: string;
    url: string;
  }[];
}

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

function resolveAvatarUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

async function getPage(slug: string): Promise<PageData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/pages/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: 'Not Found' };

  return {
    title: `${page.title || page.userName} | MyLight Link`,
    description: page.bio || `${page.userName}의 링크 모음`,
  };
}

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          {page.avatarUrl ? (
            <img
              src={resolveAvatarUrl(page.avatarUrl)!}
              alt={page.title || page.userName}
              className="mb-4 h-24 w-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl font-bold text-white shadow-lg">
              {(page.title || page.userName).charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900">
            {page.title || page.userName}
          </h1>

          {page.bio && (
            <p className="mt-2 text-center text-gray-500">{page.bio}</p>
          )}
        </div>

        <div className="space-y-4">
          {page.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-center font-medium shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:border-primary/30"
            >
              <span className="text-gray-800 group-hover:text-primary transition">
                {link.title}
              </span>
            </a>
          ))}
        </div>

        <footer className="mt-12 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 transition hover:text-primary"
          >
            MyLight Link로 만들기
          </a>
        </footer>
      </div>
    </div>
  );
}
