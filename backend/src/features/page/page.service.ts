import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/storage/storage.service';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

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

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const page = await this.prisma.page.findUnique({ where: { userId } });
    if (!page) {
      throw new NotFoundException('페이지를 찾을 수 없습니다');
    }

    if (page.avatarUrl) {
      await this.storage.delete(page.avatarUrl);
    }

    const avatarUrl = await this.storage.upload(file, 'avatars');

    return this.prisma.page.update({
      where: { userId },
      data: { avatarUrl },
    });
  }

  async removeAvatar(userId: string) {
    const page = await this.prisma.page.findUnique({ where: { userId } });
    if (!page) {
      throw new NotFoundException('페이지를 찾을 수 없습니다');
    }

    if (page.avatarUrl) {
      await this.storage.delete(page.avatarUrl);
    }

    return this.prisma.page.update({
      where: { userId },
      data: { avatarUrl: null },
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
