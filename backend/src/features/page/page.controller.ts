import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PageService } from './page.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          cb(
            new BadRequestException('JPG, PNG, WebP, GIF 파일만 업로드 가능합니다'),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('파일을 선택해주세요');
    }
    return this.pageService.uploadAvatar(userId, file);
  }

  @Delete('me/avatar')
  @UseGuards(JwtAuthGuard)
  removeAvatar(@CurrentUser('id') userId: string) {
    return this.pageService.removeAvatar(userId);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.pageService.getBySlug(slug);
  }
}
