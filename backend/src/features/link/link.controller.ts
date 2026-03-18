import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ReorderLinksDto } from './dto/reorder-links.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  getAll(@CurrentUser('id') userId: string) {
    return this.linkService.getAll(userId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateLinkDto) {
    return this.linkService.create(userId, dto);
  }

  @Patch('reorder')
  reorder(@CurrentUser('id') userId: string, @Body() dto: ReorderLinksDto) {
    return this.linkService.reorder(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linkService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.linkService.remove(id, userId);
  }
}
