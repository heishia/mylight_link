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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PageService } from './page.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
          cb(new BadRequestException('JPG, PNG, WebP, GIF 파일만 업로드 가능합니다'), false);
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
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.pageService.updateAvatar(userId, avatarUrl);
  }

  @Delete('me/avatar')
  @UseGuards(JwtAuthGuard)
  removeAvatar(@CurrentUser('id') userId: string) {
    return this.pageService.updateAvatar(userId, null);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.pageService.getBySlug(slug);
  }
}
