import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyPage(userId: string) {
    const page = await this.prisma.page.findUnique({
      where: { userId },
      include: {
        links: { orderBy: { position: 'asc' } },
      },
    });

    if (!page) {
      throw new NotFoundException('페이지를 찾을 수 없습니다');
    }

    return page;
  }

  async updateMyPage(userId: string, dto: UpdatePageDto) {
    if (dto.slug) {
      const existing = await this.prisma.page.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.userId !== userId) {
        throw new ConflictException('이미 사용 중인 slug입니다');
      }
    }

    return this.prisma.page.update({
      where: { userId },
      data: dto,
    });
  }

  async getBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: {
        links: {
          where: { isActive: true },
          orderBy: { position: 'asc' },
        },
        user: { select: { name: true } },
      },
    });

    if (!page) {
      throw new NotFoundException('페이지를 찾을 수 없습니다');
    }

    const { user, ...rest } = page;
    return { ...rest, userName: user.name };
  }
}
