import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserPage(userId: string) {
    const page = await this.prisma.page.findUnique({ where: { userId } });
    if (!page) throw new NotFoundException('페이지를 찾을 수 없습니다');
    return page;
  }

  private async verifyOwnership(linkId: string, userId: string) {
    const link = await this.prisma.link.findUnique({
      where: { id: linkId },
      include: { page: { select: { userId: true } } },
    });

    if (!link) throw new NotFoundException('링크를 찾을 수 없습니다');
    if (link.page.userId !== userId) throw new ForbiddenException();

    return link;
  }

  async getAll(userId: string) {
    const page = await this.getUserPage(userId);
    return this.prisma.link.findMany({
      where: { pageId: page.id },
      orderBy: { position: 'asc' },
    });
  }

  async create(userId: string, dto: CreateLinkDto) {
    const page = await this.getUserPage(userId);

    const maxPosition = await this.prisma.link.aggregate({
      where: { pageId: page.id },
      _max: { position: true },
    });

    return this.prisma.link.create({
      data: {
        ...dto,
        pageId: page.id,
        position: (maxPosition._max.position ?? -1) + 1,
      },
    });
  }

  async update(linkId: string, userId: string, dto: UpdateLinkDto) {
    await this.verifyOwnership(linkId, userId);

    return this.prisma.link.update({
      where: { id: linkId },
      data: dto,
    });
  }

  async remove(linkId: string, userId: string) {
    await this.verifyOwnership(linkId, userId);

    return this.prisma.link.delete({ where: { id: linkId } });
  }

  async reorder(userId: string, dto: ReorderLinksDto) {
    const page = await this.getUserPage(userId);

    await this.prisma.$transaction(
      dto.linkIds.map((id, index) =>
        this.prisma.link.updateMany({
          where: { id, pageId: page.id },
          data: { position: index },
        }),
      ),
    );

    return this.getAll(userId);
  }
}
