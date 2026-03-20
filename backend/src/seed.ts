import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.link.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ── User 1: 프론트엔드 개발자 ──
  const user1 = await prisma.user.create({
    data: {
      email: 'jimin@example.com',
      password: hashedPassword,
      name: '박지민',
      page: {
        create: {
          slug: 'jimin-dev',
          title: '지민의 개발 포트폴리오',
          bio: '프론트엔드 개발자 | React & Next.js',
          avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=jimin',
          links: {
            create: [
              { title: 'GitHub', url: 'https://github.com/jimin-dev', position: 0 },
              { title: '기술 블로그', url: 'https://jimin-dev.tistory.com', position: 1 },
              { title: 'LinkedIn', url: 'https://linkedin.com/in/jimin-park', position: 2 },
              { title: '포트폴리오 사이트', url: 'https://jimin.dev', position: 3 },
              { title: 'Figma 작업물', url: 'https://figma.com/@jimin', position: 4, isActive: false },
            ],
          },
        },
      },
    },
  });

  // ── User 2: 디자이너 ──
  const user2 = await prisma.user.create({
    data: {
      email: 'sooyoung@example.com',
      password: hashedPassword,
      name: '김수영',
      page: {
        create: {
          slug: 'sooyoung-design',
          title: '수영 | UI/UX Designer',
          bio: 'Designing delightful digital experiences',
          avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sooyoung',
          links: {
            create: [
              { title: 'Dribbble', url: 'https://dribbble.com/sooyoung', position: 0 },
              { title: 'Behance', url: 'https://behance.net/sooyoung-kim', position: 1 },
              { title: 'Instagram', url: 'https://instagram.com/sooyoung.design', position: 2 },
              { title: 'Notion 이력서', url: 'https://sooyoung.notion.site/resume', position: 3 },
            ],
          },
        },
      },
    },
  });

  // ── User 3: 유튜버 / 크리에이터 ──
  const user3 = await prisma.user.create({
    data: {
      email: 'hojun@example.com',
      password: hashedPassword,
      name: '이호준',
      page: {
        create: {
          slug: 'hojun',
          title: '호준의 코딩 채널',
          bio: '코딩 유튜버 | 주 3회 업로드',
          avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=hojun',
          links: {
            create: [
              { title: 'YouTube', url: 'https://youtube.com/@hojun-coding', position: 0 },
              { title: 'Discord 커뮤니티', url: 'https://discord.gg/hojun-dev', position: 1 },
              { title: 'GitHub', url: 'https://github.com/hojun-lee', position: 2 },
              { title: '후원하기 (Buy Me a Coffee)', url: 'https://buymeacoffee.com/hojun', position: 3 },
              { title: '뉴스레터 구독', url: 'https://hojun.substack.com', position: 4 },
              { title: '강의 (Udemy)', url: 'https://udemy.com/user/hojun-lee', position: 5 },
            ],
          },
        },
      },
    },
  });

  console.log(`Created users: ${user1.name}, ${user2.name}, ${user3.name}`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
