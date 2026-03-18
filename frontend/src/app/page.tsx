import Link from 'next/link';
import { ArrowRight, Link2, BarChart3, Palette } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-primary">MyLight Link</span>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-text-secondary hover:text-text"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-text md:text-6xl">
          하나의 링크로
          <br />
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            모든 것을 연결하세요
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
          SNS, 포트폴리오, 블로그, 쇼핑몰까지.
          <br />
          모든 링크를 하나의 페이지에 모아 공유하세요.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark hover:shadow-xl"
          >
            무료로 시작하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-surface-secondary py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold">
            왜 MyLight Link인가요?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Link2 size={28} />}
              title="무제한 링크"
              description="원하는 만큼 링크를 추가하세요. 제한 없이 모든 콘텐츠를 공유할 수 있습니다."
            />
            <FeatureCard
              icon={<Palette size={28} />}
              title="간편한 커스터마이징"
              description="프로필, 제목, 소개글을 자유롭게 설정하고 나만의 페이지를 꾸며보세요."
            />
            <FeatureCard
              icon={<BarChart3 size={28} />}
              title="쉬운 관리"
              description="직관적인 대시보드에서 링크를 추가, 수정, 삭제하고 순서를 변경하세요."
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold">지금 바로 시작하세요</h2>
          <p className="mt-4 text-lg text-text-secondary">
            30초면 나만의 링크 페이지를 만들 수 있습니다
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark"
          >
            무료로 시작하기
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} MyLight Link. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8 text-center transition hover:shadow-lg">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
