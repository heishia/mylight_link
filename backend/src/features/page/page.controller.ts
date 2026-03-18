import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PageService } from './page.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyPage(@CurrentUser('id') userId: string) {
    return this.pageService.getMyPage(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMyPage(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePageDto,
  ) {
    return this.pageService.updateMyPage(userId, dto);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.pageService.getBySlug(slug);
  }
}
